import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {ISqliteWorker, SqliteAction, FromSqliteMessage, ToSqliteMessage} from "./worker.sql";
import {AsyncQueue} from "./async-queue";
import {sqliteSqlfier} from "../../../sqlite-sqlfier";
import {ITable, RawExprUtil} from "../../../../dist";

export class IdAllocator {
    private nextId = 0;
    allocateId () {
        return ++this.nextId;
    }
}

function onMessage<ActionT extends SqliteAction> (
    data : FromSqliteMessage,
    id : number,
    action : ActionT,
    resolve : (
        data : Extract<FromSqliteMessage, { action : ActionT, error? : undefined }>
    ) => void,
    reject : (error : Error) => void
) {
    if (data.id != id) {
        reject(new Error(`Expected id ${id}; received ${data.id}`));
        return;
    }
    if (data.action != action) {
        reject(new Error(`Expected action ${action}; received ${data.action}`));
        return;
    }

    if (data.error == undefined) {
        resolve(data as any);
    } else {
        reject(new Error(data.error));
    }
}

function postMessage<ActionT extends SqliteAction, ResultT> (
    worker : ISqliteWorker,
    id : number,
    action : ActionT,
    data : Omit<Extract<ToSqliteMessage, { action : ActionT }>, "id"|"action">,
    resolve : (
        data : Extract<FromSqliteMessage, { action : ActionT, error? : undefined }>
    ) => ResultT
) {
    return new Promise<ResultT>((innerResolve, innerReject) => {
        worker.onmessage = ({data}) => {
            onMessage(
                data,
                id,
                action,
                (data) => {
                    innerResolve(resolve(data));
                },
                innerReject
            );
        };
        worker.onmessageerror = innerReject;
        worker.onerror = innerReject;

        worker.postMessage(
            {
                id,
                action,
                ...data,
            } as ToSqliteMessage
        );
    });
}

/**
 * Only one operation can be running at any point in time.
 */
export class Connection {
    private readonly idAllocator : IdAllocator;
    private readonly asyncQueue : AsyncQueue<ISqliteWorker>;

    constructor (worker : ISqliteWorker, idAllocator : IdAllocator) {
        this.idAllocator = idAllocator;
        this.asyncQueue = new AsyncQueue<ISqliteWorker>(
            () => worker
        );
    }
    deallocate () {
        return this.asyncQueue.stop();
    }

    allocateId () {
        return this.idAllocator.allocateId();
    }
    open (dbFile? : Uint8Array) {
        return this.asyncQueue.acquire((worker) => {
            return postMessage(
                worker,
                this.allocateId(),
                SqliteAction.OPEN,
                {
                    buffer : dbFile,
                },
                () => {},
            );
        });
    }
    exec (sql : string) {
        return this.asyncQueue.acquire((worker) => {
            return postMessage(
                worker,
                this.allocateId(),
                SqliteAction.EXEC,
                {
                    sql,
                },
                ({execResult, rowsModified}) => {
                    return {execResult, rowsModified};
                },
            );
        });
    }
    export () {
        return this.asyncQueue.acquire((worker) => {
            return postMessage(
                worker,
                this.allocateId(),
                SqliteAction.EXPORT,
                {},
                data => data.buffer,
            );
        });
    }
    close () {
        return this.asyncQueue.acquire((worker) => {
            return postMessage(
                worker,
                this.allocateId(),
                SqliteAction.CLOSE,
                {},
                () => {},
            );
        });
    }
    /**
     * The `impl` function will be stringified using `impl.toString()`.
     *
     * Then, the function will be "rebuilt" using `eval()`.
     *
     * This means your `impl` cannot rely on anything outside its scope.
     * It must be a "pure" function.
     *
     * Also, you really shouldn't pass user input to this method.
     */
    createFunction (functionName : string, impl : (...args : unknown[]) => unknown) {
        return this.asyncQueue.acquire((worker) => {
            return postMessage(
                worker,
                this.allocateId(),
                SqliteAction.CREATE_FUNCTION,
                {
                    functionName,
                    impl : impl.toString(),
                },
                () => {},
            );
        });
    }
    createAggregate<StateT> (
        functionName : string,
        init : () => StateT,
        step : (state : StateT, ...args : unknown[]) => void,
        finalize : (state : StateT) => unknown
    ) {
        return this.asyncQueue.acquire((worker) => {
            return postMessage(
                worker,
                this.allocateId(),
                SqliteAction.CREATE_AGGREGATE,
                {
                    functionName,
                    init : init.toString(),
                    step : step.toString(),
                    finalize : finalize.toString(),
                },
                () => {},
            );
        });
    }

    select (query : tsql.IQueryBase) : Promise<tsql.SelectResult> {
        const sql = tsql.AstUtil.toSql(query, sqliteSqlfier);
        return this.exec(sql)
            .then((result) => {
                if (result.execResult.length > 1) {
                    throw new Error(`Expected to run 1 SELECT statement; found ${result.execResult.length}`);
                }

                /**
                 * When SQLite fetches zero rows, we get zero execResults...
                 * Which is frustrating.
                 */
                const resultSet = (
                    (result.execResult.length == 0) ?
                    {
                        values : [],
                        columns : [],
                    } :
                    result.execResult[0]
                );
                return {
                    query : { sql, },
                    rows : resultSet.values.map((row) => {
                        const obj : Record<string, unknown> = {};
                        for (let i=0; i<resultSet.columns.length; ++i) {
                            const k = resultSet.columns[i];
                            const v = row[i];
                            obj[k] = v;
                        }
                        return obj;
                    }),
                    columns : resultSet.columns,
                };
            })
            .catch((err) => {
                //console.error("error encountered", sql);
                throw err;
            });
    }

    insertOne<TableT extends ITable> (table : TableT, row : tsql.InsertRow<TableT>) : Promise<tsql.InsertResult> {
        const columnAliases = tsql.TableUtil.columnAlias(table)
            .filter(columnAlias => {
                return (row as { [k:string]:unknown })[columnAlias] !== undefined;
            })
            .sort();

        const values = columnAliases.map(
            columnAlias => RawExprUtil.buildAst(
                row[columnAlias as unknown as keyof typeof row
            ])
        ).reduce<tsql.Ast[]>(
            (values, ast) => {
                if (values.length > 0) {
                    values.push(", ");
                }
                values.push(ast);
                return values;
            },
            [] as tsql.Ast[]
        );

        const ast : tsql.Ast[] = [
            `INSERT INTO`,
            /**
             * We use the `unaliasedAst` because the user may have called `setSchemaName()`
             */
            table.unaliasedAst,
            "(",
            columnAliases.map(tsql.escapeIdentifierWithDoubleQuotes).join(", "),
            ") VALUES (",
            ...values,
            ")",
        ];
        const sql = tsql.AstUtil.toSql(ast, sqliteSqlfier);
        return this.exec(sql)
            .then(async (result) => {
                if (result.execResult.length != 0) {
                    throw new Error(`insertOne() should have no result set; found ${result.execResult.length}`);
                }
                if (result.rowsModified != 1) {
                    throw new Error(`insertOne() should modify one row`);
                }

                const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                const autoIncrementId = (
                    (table.autoIncrement == undefined) ?
                    undefined :
                    (row[table.autoIncrement as keyof typeof row] === undefined) ?
                    await tsql
                        .selectValue(() => tsql.expr(
                            {
                                mapper : tm.mysql.bigIntSigned(),
                                usedRef : tsql.UsedRefUtil.fromColumnRef({}),
                            },
                            "LAST_INSERT_ROWID()"
                        ))
                        .fetchValue(this) :
                    /**
                     * Emulate MySQL behaviour
                     */
                    BigInt(0)
                );

                return {
                    query : { sql, },
                    insertedRowCount : BigInt(1),
                    autoIncrementId : (
                        autoIncrementId == undefined ?
                        undefined :
                        tm.BigIntUtil.equal(autoIncrementId, BigInt(0)) ?
                        undefined :
                        autoIncrementId
                    ),
                    warningCount : BigInt(0),
                    message : "ok",
                };
            })
            .catch((err) => {
                //console.error("error encountered", sql);
                throw err;
            });
    }
}

/**
 * Only one connection can be allocated at any point in time.
 */
export class Pool {
    private readonly worker : ISqliteWorker;
    private readonly idAllocator : IdAllocator;
    private readonly asyncQueue : AsyncQueue<Connection>;
    constructor (worker : ISqliteWorker) {
        this.worker = worker;
        this.idAllocator = new IdAllocator();
        this.asyncQueue = new AsyncQueue<Connection>(
            () => new Connection(this.worker, this.idAllocator)
        );
        this.acquire = this.asyncQueue.acquire;
    }

    readonly acquire : AsyncQueue<Connection>["acquire"];
    disconnect () : Promise<void> {
        return this.asyncQueue.stop();
    }
}
