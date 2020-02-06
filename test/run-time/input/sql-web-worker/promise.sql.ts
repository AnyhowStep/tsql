import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {ISqliteWorker, SqliteAction, FromSqliteMessage, ToSqliteMessage} from "./worker.sql";
import {
    AsyncQueue,
    PoolEventEmitter,
    IPool,
    TransactionAccessMode,
    IsolationLevel,
    IsolationLevelUtil,
    TransactionAccessModeUtil,
    DataOutOfRangeError,
    DivideByZeroError
} from "../../../../dist";
import {sqliteSqlfier} from "../../../sqlite-sqlfier";
import {
    ITable,
    BuiltInExprUtil,
    WhereClause,
    DeletableTable,
    DeleteResult,
    BuiltInAssignmentMap,
    UpdateResult
} from "../../../../dist";

const sqlite_master = tsql.table("sqlite_master")
    .addColumns({
        type : tm.string(),
        name : tm.string(),
        tbl_name : tm.string(),
        rootpage : tm.mysql.bigIntSigned(),
        sql : tm.mysql.varChar().orNull(),
    })
    .setPrimaryKey(columns => [columns.name]);

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
    return new Promise<ResultT>((innerResolve, originalInnerReject) => {
        const innerReject = (error : any) => {
            if (error instanceof Error) {
                if (error.message.startsWith("DataOutOfRangeError") || error.message.includes("overflow")) {
                    const newErr = new DataOutOfRangeError(error.message);
                    Object.defineProperty(
                        newErr,
                        "stack",
                        {
                            value : error.stack
                        }
                    );
                    originalInnerReject(newErr);
                } else if (error.message.startsWith("DivideByZeroError")) {
                    const newErr = new DivideByZeroError(error.message);
                    Object.defineProperty(
                        newErr,
                        "stack",
                        {
                            value : error.stack
                        }
                    );
                    originalInnerReject(newErr);
                } else {
                    originalInnerReject(error);
                }
            } else {
                originalInnerReject(error);
            }
        };
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

interface SharedConnectionInformation {
    /**
     * mutable
     */
    transactionData : (
        | undefined
        | {
            minimumIsolationLevel : IsolationLevel,
            accessMode : TransactionAccessMode,
        }
    );
    /**
     * mutable
     */
    savepointId : number;
}

/**
 * Only one operation can be running at any point in time.
 */
export class Connection {
    readonly pool : IPool;
    private readonly idAllocator : IdAllocator;
    private readonly asyncQueue : AsyncQueue<ISqliteWorker>;
    private readonly sharedConnectionInfo : SharedConnectionInformation;

    readonly eventEmitters : tsql.IConnectionEventEmitterCollection;

    constructor (
        pool : IPool,
        worker : ISqliteWorker|AsyncQueue<ISqliteWorker>,
        idAllocator : IdAllocator,
        sharedConnectionInfo : SharedConnectionInformation,
        eventEmitters : tsql.IConnectionEventEmitterCollection
    ) {
        this.pool = pool;
        this.idAllocator = idAllocator;
        this.sharedConnectionInfo = sharedConnectionInfo;
        this.eventEmitters = eventEmitters;

        this.asyncQueue = worker instanceof AsyncQueue ?
            worker :
            new AsyncQueue<ISqliteWorker>(
                () => {
                    return {
                        item : worker,
                        deallocate : async () => {}
                    };
                }
            );
    }
    async deallocate () {
        await this.asyncQueue.stop();
        /**
         * @todo Handle sync errors somehow.
         * Maybe propagate them to `IPool` and have an `onError` handler or something
         */
        this.eventEmitters.commit();
    }
    isDeallocated () {
        return this.asyncQueue.getShouldStop();
    }

    allocateId () {
        return this.idAllocator.allocateId();
    }
    open (dbFile? : Uint8Array) {
        return this.asyncQueue.enqueue((worker) => {
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
        return this.asyncQueue.enqueue((worker) => {
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
    rawQuery (sql : string) : Promise<tsql.RawQueryResult> {
        return this.exec(sql)
            .then((result) : tsql.RawQueryResult => {
                if (result.execResult.length == 0) {
                    return {
                        query : { sql },
                        results : undefined,
                        columns : [],
                    };
                }
                return {
                    query : { sql },
                    results : result.execResult[0].values,
                    columns : result.execResult[0].columns,
                };
            });
    }
    export () {
        return this.asyncQueue.enqueue((worker) => {
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
        return this.asyncQueue.enqueue((worker) => {
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
        return this.asyncQueue.enqueue((worker) => {
            return postMessage(
                worker,
                this.allocateId(),
                SqliteAction.CREATE_FUNCTION,
                {
                    functionName,
                    options : {
                        isVarArg : false,
                    },
                    impl : impl.toString(),
                },
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
    createVarArgFunction (functionName : string, impl : (...args : unknown[]) => unknown) {
        return this.asyncQueue.enqueue((worker) => {
            return postMessage(
                worker,
                this.allocateId(),
                SqliteAction.CREATE_FUNCTION,
                {
                    functionName,
                    options : {
                        isVarArg : true,
                    },
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
        return this.asyncQueue.enqueue((worker) => {
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

    async lock<ResultT> (
        callback : tsql.LockCallback<tsql.IConnection, ResultT>
    ) : Promise<ResultT> {
        return this.asyncQueue.lock((nestedAsyncQueue) => {
            const nestedConnection = new Connection(
                this.pool,
                nestedAsyncQueue,
                this.idAllocator,
                this.sharedConnectionInfo,
                this.eventEmitters
            );
            return callback(
                nestedConnection as unknown as tsql.IConnection
            );
        });
    }

    tryGetFullConnection () : tsql.IConnection|undefined {
        if (
            this.sharedConnectionInfo.transactionData != undefined &&
            this.sharedConnectionInfo.transactionData.accessMode == TransactionAccessMode.READ_ONLY
        ) {
            /**
             * Can't give a full connection if we are in a readonly transaction.
             * No `INSERT/UPDATE/DELETE` allowed.
             */
            return undefined;
        } else {
            return this as unknown as tsql.IConnection;
        }
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
                const selectResult : tsql.SelectResult = {
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
                return selectResult;
            })
            .catch((err) => {
                //console.log(sql);
                //console.error("error encountered", sql);
                throw err;
            });
    }

    private insertOneSqlString<TableT extends ITable> (
        table : TableT,
        row : tsql.BuiltInInsertRow<TableT>,
        modifier : string
    ) : string {
        const columnAliases = tsql.TableUtil.columnAlias(table)
            .filter(columnAlias => {
                return (row as { [k:string]:unknown })[columnAlias] !== undefined;
            })
            .sort();

        const values = columnAliases
            .map(columnAlias => BuiltInExprUtil.buildAst(
                row[columnAlias as unknown as keyof typeof row]
            ))
            .reduce<tsql.Ast[]>(
                (values, ast) => {
                    if (values.length > 0) {
                        values.push(", ");
                    }
                    values.push(ast);
                    return values;
                },
                [] as tsql.Ast[]
            );

        const ast : tsql.Ast[] = values.length == 0 ?
            [
                `INSERT ${modifier} INTO`,
                /**
                 * We use the `unaliasedAst` because the user may have called `setSchemaName()`
                 */
                table.unaliasedAst,
                "DEFAULT VALUES",
            ] :
            [
                `INSERT ${modifier} INTO`,
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
        return tsql.AstUtil.toSql(ast, sqliteSqlfier);
    }

    insertOne<TableT extends ITable> (table : TableT, row : tsql.BuiltInInsertRow<TableT>) : Promise<tsql.InsertOneResult> {
        const sql = this.insertOneSqlString(table, row, "");
        return this.lock((rawNestedConnection) => {
            const nestedConnection = (rawNestedConnection as unknown as Connection);
            return nestedConnection.exec(sql)
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
                                    isAggregate : false,
                                },
                                "LAST_INSERT_ROWID()"
                            ))
                            .fetchValue(nestedConnection) :
                        /**
                         * Emulate MySQL behaviour
                         */
                        BigInt(0)
                    );

                    const insertOneResult : tsql.InsertOneResult = {
                        query : { sql, },
                        insertedRowCount : BigInt(1) as 1n,
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
                    return insertOneResult;
                })
                .catch((err) => {
                    //console.error("error encountered", sql);
                    throw err;
                });
        });
    }

    replaceOne<TableT extends ITable> (table : TableT, row : tsql.BuiltInInsertRow<TableT>) : Promise<tsql.ReplaceOneResult> {
        const sql = this.insertOneSqlString(table, row, "OR REPLACE");
        return this.lock((rawNestedConnection) => {
            const nestedConnection = (rawNestedConnection as unknown as Connection);
            return nestedConnection.exec(sql)
                .then(async (result) => {
                    if (result.execResult.length != 0) {
                        throw new Error(`replaceOne() should have no result set; found ${result.execResult.length}`);
                    }
                    if (result.rowsModified != 1) {
                        throw new Error(`replaceOne() should modify one row`);
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
                                    isAggregate : false,
                                },
                                "LAST_INSERT_ROWID()"
                            ))
                            .fetchValue(nestedConnection) :
                        /**
                         * Emulate MySQL behaviour
                         */
                        BigInt(0)
                    );

                    return {
                        query : { sql, },
                        insertedOrReplacedRowCount : BigInt(1) as 1n,
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
        });
    }

    insertIgnoreOne<TableT extends ITable> (table : TableT, row : tsql.BuiltInInsertRow<TableT>) : Promise<tsql.InsertIgnoreOneResult> {
        const sql = this.insertOneSqlString(table, row, "OR IGNORE");
        return this.lock((rawNestedConnection) => {
            const nestedConnection = (rawNestedConnection as unknown as Connection);
            return nestedConnection.exec(sql)
                .then(async (result) => {
                    if (result.execResult.length != 0) {
                        throw new Error(`insertIgnoreOne() should have no result set; found ${result.execResult.length}`);
                    }
                    if (result.rowsModified != 0 && result.rowsModified != 1) {
                        throw new Error(`insertIgnoreOne() should modify zero or one row`);
                    }

                    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                    if (result.rowsModified == 0) {
                        return {
                            query : { sql, },
                            insertedRowCount : BigInt(result.rowsModified) as 0n,
                            autoIncrementId : undefined,
                            warningCount : BigInt(1),
                            message : "ok",
                        };
                    }

                    const autoIncrementId = (
                        (table.autoIncrement == undefined) ?
                        undefined :
                        (row[table.autoIncrement as keyof typeof row] === undefined) ?
                        await tsql
                            .selectValue(() => tsql.expr(
                                {
                                    mapper : tm.mysql.bigIntSigned(),
                                    usedRef : tsql.UsedRefUtil.fromColumnRef({}),
                                    isAggregate : false,
                                },
                                "LAST_INSERT_ROWID()"
                            ))
                            .fetchValue(nestedConnection) :
                        /**
                         * Emulate MySQL behaviour
                         */
                        BigInt(0)
                    );

                    return {
                        query : { sql, },
                        insertedRowCount : BigInt(result.rowsModified) as 1n,
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
        });
    }

    private async fetchTableStructure (tableName : string) {
        const sql = await sqlite_master
            .whereEqPrimaryKey({
                name : tableName,
            })
            .fetchValue(
                this,
                columns => columns.sql
            );
        if (sql == undefined) {
            throw new Error(`Table ${tableName} should have SQL string`);
        }

        //Modified version of
        //http://afoucal.free.fr/index.php/2009/01/26/get-default-value-and-unique-attribute-field-sqlite-database-using-air/
        const allColumnDefSql = sql.replace(/^CREATE\s+\w+\s+(("\w+"|\w+)|\[(.+)\])\s+(\(|AS|)/im , "");
        function getColumnDefSqlImpl (columnAlias : string) {
            const columnRegex = new RegExp(columnAlias + "(.*?)(,|\r|$)", "m");

            const columnDefSqlMatch = allColumnDefSql.match(columnRegex);
            if (columnDefSqlMatch == undefined) {
                return undefined;
            }
            return columnDefSqlMatch[1];
        }
        function getColumnDefSql (columnAlias : string) {
            const resultQuoted = getColumnDefSqlImpl(tsql.escapeIdentifierWithDoubleQuotes(columnAlias));
            if (resultQuoted != undefined) {
                return resultQuoted;
            }
            const resultUnquoted = getColumnDefSqlImpl(columnAlias);
            if (resultUnquoted != undefined) {
                return resultUnquoted;
            }
            throw new Error(`Cannot find column definition for ${tableName}.${columnAlias}`);
        }
        function isAutoIncrement (columnAlias : string) {
            return /AUTOINCREMENT/i.test(getColumnDefSql(columnAlias));
        }
        function isUnique (columnAlias : string) {
            return /UNIQUE/i.test(getColumnDefSql(columnAlias));
        }
        function isPrimaryKey (columnAlias : string) {
            return /PRIMARY\s+KEY/i.test(getColumnDefSql(columnAlias));
        }

        let constraintSql = allColumnDefSql;

        const {execResult} = await this
            .exec(`pragma table_info(${tsql.escapeIdentifierWithDoubleQuotes(tableName)})`);
        if (execResult.length != 1) {
            throw new Error(`Expected to fetch table info`);
        }

        const candidateKeys : tsql.CandidateKeyMeta[] = [];
        let primaryKey : tsql.CandidateKeyMeta|undefined = undefined;

        const resultSet = execResult[0];
        const objArr = resultSet.values.map((row) => {
            const obj = resultSet.columns.reduce(
                (obj, columnAlias, index) => {
                    (obj as any)[columnAlias] = row[index];
                    return obj;
                },
                {}
            );
            (obj as any).isAutoIncrement = isAutoIncrement((obj as any).name);
            (obj as any).isUnique = isUnique((obj as any).name);
            (obj as any).isPrimaryKey = isPrimaryKey((obj as any).name);

            const columnDef = getColumnDefSql((obj as any).name);
            constraintSql = constraintSql.replace(columnDef, "");

            if (isPrimaryKey((obj as any).name)) {
                if (primaryKey != undefined) {
                    throw new Error(`Multiple primary keys found`);
                }
                primaryKey = {
                    candidateKeyName : (obj as any).name,
                    columnAliases : [(obj as any).name],
                };
            } else if (isUnique((obj as any).name)) {
                const constraintRegex = /CONSTRAINT\s+(.+)\s+UNIQUE/gi;
                const constraintMatch = constraintRegex.exec(columnDef);
                if (constraintMatch == undefined) {
                    throw new Error(`Cannot get UNIQUE constraint of ${(obj as any).name}`);
                }
                candidateKeys.push({
                    candidateKeyName : tsql.tryUnescapeIdentifierWithDoubleQuotes(constraintMatch[1]),
                    columnAliases : [(obj as any).name],
                });
            }
            return obj;
        });

        const constraintRegex = /CONSTRAINT\s+(.+)\s+(UNIQUE|PRIMARY\s+KEY)\s*\((.+)\)/gi;
        while (true) {
            const constraintMatch = constraintRegex.exec(constraintSql);
            if (constraintMatch == undefined) {
                break;
            }
            const constraintName = tsql.tryUnescapeIdentifierWithDoubleQuotes(constraintMatch[1]);
            const constraintType = constraintMatch[2];
            const constraintColumns = constraintMatch[3];
            const columnRegex = /\s*(.+?)\s*(,|$)/gi;

            const columnAliases : string[] = [];

            while (true) {
                const columnMatch = columnRegex.exec(constraintColumns);
                if (columnMatch == undefined) {
                    break;
                }
                columnAliases.push(tsql.tryUnescapeIdentifierWithDoubleQuotes(columnMatch[1]));
            }

            if (constraintType.toUpperCase() == "UNIQUE") {
                candidateKeys.push({
                    candidateKeyName : constraintName,
                    columnAliases,
                });
            } else {
                if (primaryKey != undefined) {
                    throw new Error(`Multiple primary keys found`);
                }
                primaryKey = {
                    candidateKeyName : constraintName,
                    columnAliases,
                };
            }
        }

        return {
            columns : objArr as {
                cid : bigint,
                name : string,
                type : string,
                notnull : 1n|0n,
                dflt_value : string|null,
                pk : 1n|0n,
                isAutoIncrement : boolean,
                isUnique : boolean,
                isPrimaryKey : boolean,
            }[],
            candidateKeys,
            primaryKey,
        };
    }

    private async insertManySqlString<TableT extends ITable> (
        table : TableT,
        rows : readonly [tsql.BuiltInInsertRow<TableT>, ...tsql.BuiltInInsertRow<TableT>[]],
        modifier : string
    ) : Promise<string> {
        const structure = (await this.fetchTableStructure(table.alias)).columns;
        //console.log(structure);

        const columnAliases = tsql.TableUtil.columnAlias(table)
            .sort();

        const values = rows.map(row => {
            const ast = columnAliases
                .map(columnAlias => {
                    const value = row[columnAlias as unknown as keyof typeof row];
                    if (value === undefined) {
                        const columnDef = structure.find(columnDef => {
                            return columnDef.name == columnAlias;
                        });
                        if (columnDef == undefined) {
                            throw new Error(`Unknown column ${table.alias}.${columnAlias}`);
                        }
                        if (columnDef.dflt_value != undefined) {
                            return columnDef.dflt_value;
                        }

                        if (tm.BigIntUtil.equal(columnDef.notnull, tm.BigInt(1))) {
                            if (columnDef.isAutoIncrement) {
                                return "NULL";
                            }
                            throw new Error(`${table.alias}.${columnAlias} is not nullable`);
                        } else {
                            return "NULL";
                        }
                    } else {
                        return BuiltInExprUtil.buildAst(
                            value
                        );
                    }
                })
                .reduce<tsql.Ast[]>(
                    (values, ast) => {
                        if (values.length > 0) {
                            values.push(", ");
                        }
                        values.push(ast);
                        return values;
                    },
                    [] as tsql.Ast[]
                );
            ast.unshift("(");
            ast.push(")");
            return ast;
        })
        .reduce<tsql.Ast[]>(
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
            `INSERT ${modifier} INTO`,
            /**
             * We use the `unaliasedAst` because the user may have called `setSchemaName()`
             */
            table.unaliasedAst,
            "(",
            columnAliases.map(tsql.escapeIdentifierWithDoubleQuotes).join(", "),
            ") VALUES",
            ...values,
        ];
        const sql = tsql.AstUtil.toSql(ast, sqliteSqlfier);
        return sql;
    }

    /**
     * Unfortunately... This is SQLite.
     *
     * SQLite does not support the `DEFAULT` keyword present in MySQL and PostgreSQL
     * ```sql
     *  INSERT INTO
     *      myTable (a, b)
     *  VALUES
     *      -- Error invalid syntax `DEFAULT`
     *      (DEFAULT, 42);
     * ```
     *
     * So, we need to break this into multiple `.insertOne()` statements
     * to work for all cases.
     *
     * We can probably be more efficient and group rows into batches if they're
     * consecutive and have the same columns that are defined but...
     *
     * Too much work for now.
     *
     * -----
     *
     * The thing is, if even one of the rows has an error on `INSERT`,
     * then all `INSERT` must be rolled back.
     */
    async insertMany<TableT extends ITable> (
        table : TableT,
        rows : readonly [tsql.BuiltInInsertRow<TableT>, ...tsql.BuiltInInsertRow<TableT>[]]
    ) : Promise<tsql.InsertManyResult> {
        const sql = await this.insertManySqlString(table, rows, "");
        return this.lock(async (rawNestedConnection) : Promise<tsql.InsertManyResult> => {
            const nestedConnection = rawNestedConnection as unknown as Connection;
            return nestedConnection.exec(sql)
                .then(async (result) => {
                    if (result.execResult.length != 0) {
                        throw new Error(`insertMany() should have no result set; found ${result.execResult.length}`);
                    }
                    if (result.rowsModified != rows.length) {
                        throw new Error(`insertMany() should modify ${rows.length} rows; only modified ${result.rowsModified} rows`);
                    }

                    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                    return {
                        query : { sql, },
                        insertedRowCount : BigInt(result.rowsModified),
                        warningCount : BigInt(0),
                        message : "ok",
                    };
                })
                .catch((err) => {
                    //console.error("error encountered", sql);
                    throw err;
                });
        });
    }

    async insertIgnoreMany<TableT extends ITable> (
        table : TableT,
        rows : readonly [tsql.BuiltInInsertRow<TableT>, ...tsql.BuiltInInsertRow<TableT>[]]
    ) : Promise<tsql.InsertIgnoreManyResult> {
        const sql = await this.insertManySqlString(table, rows, "OR IGNORE");
        return this.lock(async (rawNestedConnection) : Promise<tsql.InsertIgnoreManyResult> => {
            const nestedConnection = rawNestedConnection as unknown as Connection;
            return nestedConnection.exec(sql)
                .then(async (result) => {
                    if (result.execResult.length != 0) {
                        throw new Error(`insertIgnoreMany() should have no result set; found ${result.execResult.length}`);
                    }
                    if (result.rowsModified > rows.length) {
                        throw new Error(`insertIgnoreMany() should modify ${rows.length} rows or less; modified ${result.rowsModified} rows`);
                    }

                    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                    return {
                        query : { sql, },
                        insertedRowCount : BigInt(result.rowsModified),
                        warningCount : BigInt(rows.length - result.rowsModified),
                        message : "ok",
                    };
                })
                .catch((err) => {
                    //console.error("error encountered", sql);
                    throw err;
                });
        });
    }

    async replaceMany<TableT extends ITable> (
        table : TableT,
        rows : readonly [tsql.BuiltInInsertRow<TableT>, ...tsql.BuiltInInsertRow<TableT>[]]
    ) : Promise<tsql.ReplaceManyResult> {
        const sql = await this.insertManySqlString(table, rows, "OR REPLACE");
        return this.exec(sql)
            .then(async (result) => {
                if (result.execResult.length != 0) {
                    throw new Error(`replaceMany() should have no result set; found ${result.execResult.length}`);
                }
                if (result.rowsModified != rows.length) {
                    throw new Error(`replaceMany() should modify ${rows.length} rows; modified ${result.rowsModified} rows`);
                }

                const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                return {
                    query : { sql, },
                    insertedOrReplacedRowCount : BigInt(result.rowsModified),
                    warningCount : BigInt(0),
                    message : "ok",
                };
            })
            .catch((err) => {
                //console.error("error encountered", sql);
                throw err;
            });
    }

    private async insertSelectSqlString<
        QueryT extends tsql.QueryBaseUtil.AfterSelectClause,
        TableT extends tsql.InsertableTable
    > (
        query : QueryT,
        table : TableT,
        row : tsql.InsertSelectRow<QueryT, TableT>,
        modifier : string
    ) : Promise<string> {
        const structure = (await this.fetchTableStructure(table.alias)).columns;
        //console.log(structure);

        const columnAliases = tsql.TableUtil.columnAlias(table)
            .sort();

        const values = columnAliases
            .map(columnAlias => {
                const value = row[columnAlias as unknown as keyof typeof row];
                if (value === undefined) {
                    const columnDef = structure.find(columnDef => {
                        return columnDef.name == columnAlias;
                    });
                    if (columnDef == undefined) {
                        throw new Error(`Unknown column ${table.alias}.${columnAlias}`);
                    }
                    if (columnDef.dflt_value != undefined) {
                        return columnDef.dflt_value;
                    }

                    if (tm.BigIntUtil.equal(columnDef.notnull, tm.BigInt(1))) {
                        if (columnDef.isAutoIncrement) {
                            return "NULL";
                        }
                        throw new Error(`${table.alias}.${columnAlias} is not nullable`);
                    } else {
                        return "NULL";
                    }
                } else {
                    if (tsql.ColumnUtil.isColumn(value)) {
                        return tsql.escapeIdentifierWithDoubleQuotes(
                            `${(value as tsql.IColumn).tableAlias}${tsql.SEPARATOR}${(value as tsql.IColumn).columnAlias}`
                        );
                    } else {
                        return BuiltInExprUtil.buildAst(
                            value
                        );
                    }
                }
            })
            .reduce<tsql.Ast[]>(
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
            `INSERT ${modifier} INTO`,
            /**
             * We use the `unaliasedAst` because the user may have called `setSchemaName()`
             */
            table.unaliasedAst,
            "(",
            columnAliases.map(tsql.escapeIdentifierWithDoubleQuotes).join(", "),
            ")",
            "SELECT",
            ...values,
            "FROM",
            "(",
            query,
            ") AS tmp"
        ];
        const sql = tsql.AstUtil.toSql(ast, sqliteSqlfier);
        return sql;
    }

    async insertSelect<
        QueryT extends tsql.QueryBaseUtil.AfterSelectClause & tsql.QueryBaseUtil.NonCorrelated,
        TableT extends tsql.InsertableTable
    > (
        query : QueryT,
        table : TableT,
        row : tsql.InsertSelectRow<QueryT, TableT>
    ) : Promise<tsql.InsertManyResult> {
        const sql = await this.insertSelectSqlString(query, table, row, "");
        return this.lock(async (rawNestedConnection) : Promise<tsql.InsertManyResult> => {
            const nestedConnection = rawNestedConnection as unknown as Connection;
            return nestedConnection.exec(sql)
                .then(async (result) => {
                    if (result.execResult.length != 0) {
                        throw new Error(`insertSelect() should have no result set; found ${result.execResult.length}`);
                    }
                    if (result.rowsModified < 0) {
                        throw new Error(`insertSelect() should modify zero, or more rows; modified ${result.rowsModified} rows`);
                    }

                    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                    return {
                        query : { sql, },
                        insertedRowCount : BigInt(result.rowsModified),
                        warningCount : BigInt(0),
                        message : "ok",
                    };
                })
                .catch((err) => {
                    //console.error("error encountered", sql);
                    throw err;
                });
        });
    }

    async insertIgnoreSelect<
        QueryT extends tsql.QueryBaseUtil.AfterSelectClause & tsql.QueryBaseUtil.NonCorrelated,
        TableT extends tsql.InsertableTable
    > (
        query : QueryT,
        table : TableT,
        row : tsql.InsertSelectRow<QueryT, TableT>
    ) : Promise<tsql.InsertIgnoreManyResult> {
        const sql = await this.insertSelectSqlString(query, table, row, "OR IGNORE");
        return this.transactionIfNotInOne(async (rawNestedConnection) : Promise<tsql.InsertIgnoreManyResult> => {
            const nestedConnection = rawNestedConnection as unknown as Connection;
            const maxInsertCount = await tsql.ExecutionUtil.count(query, nestedConnection);
            return nestedConnection.exec(sql)
                .then(async (result) => {
                    if (result.execResult.length != 0) {
                        throw new Error(`insertIgnoreSelect() should have no result set; found ${result.execResult.length}`);
                    }
                    if (result.rowsModified < 0) {
                        throw new Error(`insertIgnoreSelect() should modify zero, or more rows; modified ${result.rowsModified} rows`);
                    }

                    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                    return {
                        query : { sql, },
                        insertedRowCount : BigInt(result.rowsModified),
                        warningCount : tm.BigIntUtil.sub(
                            maxInsertCount,
                            result.rowsModified
                        ),
                        message : "ok",
                    };
                })
                .catch((err) => {
                    //console.error("error encountered", sql);
                    throw err;
                });
        });
    }

    async replaceSelect<
        QueryT extends tsql.QueryBaseUtil.AfterSelectClause & tsql.QueryBaseUtil.NonCorrelated,
        TableT extends tsql.InsertableTable & tsql.DeletableTable
    > (
        query : QueryT,
        table : TableT,
        row : tsql.InsertSelectRow<QueryT, TableT>
    ) : Promise<tsql.ReplaceManyResult> {
        const sql = await this.insertSelectSqlString(query, table, row, "OR REPLACE");
        return this.exec(sql)
            .then(async (result) => {
                if (result.execResult.length != 0) {
                    throw new Error(`replaceSelect() should have no result set; found ${result.execResult.length}`);
                }
                if (result.rowsModified < 0) {
                    throw new Error(`replaceSelect() should modify zero, or more rows; modified ${result.rowsModified} rows`);
                }

                const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                return {
                    query : { sql, },
                    insertedOrReplacedRowCount : BigInt(result.rowsModified),
                    warningCount : BigInt(0),
                    message : "ok",
                };
            })
            .catch((err) => {
                //console.error("error encountered", sql);
                throw err;
            });
    }

    delete (
        table : DeletableTable,
        whereClause : WhereClause
    ) : Promise<DeleteResult> {
        const ast : tsql.Ast[] = [
            "DELETE FROM",
            table.unaliasedAst,
            "WHERE",
            whereClause.ast
        ];
        const sql = tsql.AstUtil.toSql(ast, sqliteSqlfier);
        return this.exec(sql)
            .then(async (result) => {
                if (result.execResult.length != 0) {
                    throw new Error(`delete() should have no result set; found ${result.execResult.length}`);
                }
                if (result.rowsModified < 0) {
                    throw new Error(`delete() should modify zero, or more rows; modified ${result.rowsModified} rows`);
                }

                const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                return {
                    query : { sql, },
                    deletedRowCount : BigInt(result.rowsModified),
                    warningCount : BigInt(0),
                    message : "ok",
                };
            })
            .catch((err) => {
                //console.error("error encountered", sql);
                throw err;
            });
    }

    update<TableT extends ITable> (
        table : TableT,
        whereClause : WhereClause,
        assignmentMap : BuiltInAssignmentMap<TableT>
    ) : Promise<UpdateResult> {
        const mutableColumnAlias = Object.keys(assignmentMap)
            .filter(columnAlias => {
                const value = assignmentMap[columnAlias as keyof typeof assignmentMap];
                return (
                    value !== undefined &&
                    table.mutableColumns.indexOf(columnAlias) >= 0
                );
            })
            .sort();

        if (mutableColumnAlias.length == 0) {
            //Empty assignment list...
            return tsql.from(table as any)
                .where(() => whereClause as any)
                .count(this)
                .then((count) => {
                    return {
                        query : {
                            /**
                             * No `UPDATE` statement executed
                             */
                            sql : "",
                        },
                        foundRowCount : count,
                        updatedRowCount : BigInt(0),
                        warningCount : BigInt(0),
                        message : "ok",
                    };
                });
        }

        const assignmentList = mutableColumnAlias.reduce<tsql.Ast[]>(
            (ast, columnAlias) => {
                const value = assignmentMap[columnAlias as keyof typeof assignmentMap];
                const assignment = [
                    tsql.escapeIdentifierWithDoubleQuotes(columnAlias),
                    "=",
                    tsql.BuiltInExprUtil.buildAst(value as Exclude<typeof value, undefined>)
                ];

                if (ast.length > 0) {
                    ast.push(",");
                }
                ast.push(assignment);
                return ast;
            },
            []
        );

        const ast : tsql.Ast[] = [
            "UPDATE",
            table.unaliasedAst,
            "SET",
            ...assignmentList,
            "WHERE",
            whereClause.ast
        ];
        const sql = tsql.AstUtil.toSql(ast, sqliteSqlfier);
        return this.exec(sql)
            .then(async (result) => {
                if (result.execResult.length != 0) {
                    throw new Error(`update() should have no result set; found ${result.execResult.length}`);
                }
                if (result.rowsModified < 0) {
                    throw new Error(`update() should modify zero, or more rows; modified ${result.rowsModified} rows`);
                }

                const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                return {
                    query : { sql, },
                    foundRowCount : BigInt(result.rowsModified),
                    updatedRowCount : BigInt(result.rowsModified),
                    warningCount : BigInt(0),
                    message : "ok",
                };
            })
            .catch((err) => {
                //console.error("error encountered", sql);
                throw err;
            });
    }

    rollback () : Promise<void> {
        if (!this.isInTransaction()) {
            return Promise.reject(new Error("Not in transaction; cannot rollback"));
        }
        return this.exec("ROLLBACK")
            .then(() => {
                this.sharedConnectionInfo.transactionData = undefined;
                /**
                 * @todo Handle sync errors somehow.
                 * Maybe propagate them to `IPool` and have an `onError` handler or something
                 */
                this.eventEmitters.rollback();
            });
    }
    commit () : Promise<void> {
        if (!this.isInTransaction()) {
            return Promise.reject(new Error("Not in transaction; cannot commit"));
        }
        return this.exec("COMMIT")
            .then(() => {
                this.sharedConnectionInfo.transactionData = undefined;
                /**
                 * @todo Handle sync errors somehow.
                 * Maybe propagate them to `IPool` and have an `onError` handler or something
                 */
                this.eventEmitters.commit();
            });
    }

    getMinimumIsolationLevel () : IsolationLevel {
        if (this.sharedConnectionInfo.transactionData == undefined) {
            throw new Error(`Not in transaction`);
        }
        return this.sharedConnectionInfo.transactionData.minimumIsolationLevel;
    }
    getTransactionAccessMode () : TransactionAccessMode {
        if (this.sharedConnectionInfo.transactionData == undefined) {
            throw new Error(`Not in transaction`);
        }
        return this.sharedConnectionInfo.transactionData.accessMode;
    }

    isInTransaction () : this is tsql.ITransactionConnection {
        return this.sharedConnectionInfo.transactionData != undefined;
    }
    private transactionImpl<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        accessMode : TransactionAccessMode,
        callback : tsql.LockCallback<tsql.ITransactionConnection, ResultT>|tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT> {
        if (this.sharedConnectionInfo.transactionData != undefined) {
            return Promise.reject(new Error(`Transaction already started or starting`));
        }
        /**
         * SQLite only has `SERIALIZABLE` transactions.
         * So, no matter what we request, we will always get a
         * `SERIALIZABLE` transaction.
         *
         * However, we will just pretend that we have all
         * isolation levels supported.
         */
        this.sharedConnectionInfo.transactionData = {
            minimumIsolationLevel,
            accessMode,
        };

        return new Promise<ResultT>((resolve, reject) => {
            this.exec("BEGIN TRANSACTION")
                .then(() => {
                    /**
                     * @todo Handle sync errors somehow.
                     * Maybe propagate them to `IPool` and have an `onError` handler or something
                     */
                    this.eventEmitters.commit();
                    if (!this.isInTransaction()) {
                        /**
                         * Why did one of the `OnCommit` listeners call `commit()` or `rollback()`?
                         */
                        throw new Error(`Expected to be in transaction`);
                    }
                    return callback(this as unknown as tsql.ITransactionConnection);
                })
                .then((result) => {
                    if (!this.isInTransaction()) {
                        resolve(result);
                        return;
                    }

                    this.commit()
                        .then(() => {
                            resolve(result);
                        })
                        .catch((commitErr) => {
                            this.rollback()
                                .then(() => {
                                    reject(commitErr);
                                })
                                .catch((rollbackErr) => {
                                    commitErr.rollbackErr = rollbackErr;
                                    reject(commitErr);
                                });
                        });
                })
                .catch((err) => {
                    if (!this.isInTransaction()) {
                        reject(err);
                        return;
                    }

                    this.rollback()
                        .then(() => {
                            reject(err);
                        })
                        .catch((rollbackErr) => {
                            err.rollbackErr = rollbackErr;
                            reject(err);
                        });
                });
        });
    }
    private transactionIfNotInOneImpl<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        accessMode : TransactionAccessMode,
        callback : tsql.LockCallback<tsql.ITransactionConnection, ResultT>|tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT> {
        return this.lock(async (nestedConnection) => {
            if (nestedConnection.isInTransaction()) {
                if (IsolationLevelUtil.isWeakerThan(
                    this.getMinimumIsolationLevel(),
                    minimumIsolationLevel
                )) {
                    /**
                     * For example, our current isolation level is
                     * `READ_UNCOMMITTED` but we want
                     * `SERIALIZABLE`.
                     *
                     * Obviously, `READ_UNCOMMITTED` is weaker than
                     * `SERIALIZABLE`.
                     *
                     * So, we error.
                     *
                     * @todo Custom error type
                     */
                    return Promise.reject(new Error(`Current isolation level is ${this.getMinimumIsolationLevel()}; cannot guarantee ${minimumIsolationLevel}`));
                }
                if (TransactionAccessModeUtil.isLessPermissiveThan(
                    this.getTransactionAccessMode(),
                    accessMode
                )) {
                    return Promise.reject(new Error(`Current transaction access mode is ${this.getTransactionAccessMode()}; cannot allow ${accessMode}`));
                }
                try {
                    return callback(nestedConnection);
                } catch (err) {
                    return Promise.reject(err);
                }
            } else {
                return (nestedConnection as unknown as Connection).transactionImpl(
                    minimumIsolationLevel,
                    accessMode,
                    callback
                );
            }
        });
    }
    transaction<ResultT> (
        callback : tsql.LockCallback<tsql.ITransactionConnection, ResultT>
    ) : Promise<ResultT>;
    transaction<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : tsql.LockCallback<tsql.ITransactionConnection, ResultT>
    ) : Promise<ResultT>;
    transaction<ResultT> (
        ...args : (
            | [tsql.LockCallback<tsql.ITransactionConnection, ResultT>]
            | [IsolationLevel, tsql.LockCallback<tsql.ITransactionConnection, ResultT>]
        )
    ) : Promise<ResultT> {
        return this.lock(async (nestedConnection) => {
            return (nestedConnection as unknown as Connection).transactionImpl(
                args.length == 1 ? IsolationLevel.SERIALIZABLE : args[0],
                TransactionAccessMode.READ_WRITE,
                args.length == 1 ? args[0] : args[1]
            );
        });
    }
    transactionIfNotInOne<ResultT> (
        callback : tsql.LockCallback<tsql.ITransactionConnection, ResultT>
    ) : Promise<ResultT>;
    transactionIfNotInOne<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : tsql.LockCallback<tsql.ITransactionConnection, ResultT>
    ) : Promise<ResultT>;
    transactionIfNotInOne<ResultT> (
        ...args : (
            | [tsql.LockCallback<tsql.ITransactionConnection, ResultT>]
            | [IsolationLevel, tsql.LockCallback<tsql.ITransactionConnection, ResultT>]
        )
    ) : Promise<ResultT> {
        return this.transactionIfNotInOneImpl(
            args.length == 1 ? IsolationLevel.SERIALIZABLE : args[0],
            TransactionAccessMode.READ_WRITE,
            args.length == 1 ? args[0] : args[1]
        );
    }
    readOnlyTransaction<ResultT> (
        ...args : (
            | [tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>]
            | [IsolationLevel, tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>]
        )
    ) : Promise<ResultT> {
        return this.lock(async (nestedConnection) => {
            return (nestedConnection as unknown as Connection).transactionImpl(
                args.length == 1 ? IsolationLevel.SERIALIZABLE : args[0],
                TransactionAccessMode.READ_ONLY,
                args.length == 1 ? args[0] : args[1]
            );
        });
    }
    readOnlyTransactionIfNotInOne<ResultT> (
        ...args : (
            | [tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>]
            | [IsolationLevel, tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>]
        )
    ) : Promise<ResultT> {
        return this.transactionIfNotInOneImpl(
            args.length == 1 ? IsolationLevel.SERIALIZABLE : args[0],
            TransactionAccessMode.READ_ONLY,
            args.length == 1 ? args[0] : args[1]
        );
    }

    rollbackToSavepoint () : Promise<void> {
        if (this.savepointData == undefined) {
            return Promise.reject(new Error("Not in savepoint; cannot release savepoint"));
        }
        return this.exec(`ROLLBACK TO SAVEPOINT ${this.savepointData.savepointName}`)
            .then(() => {
                this.savepointData = undefined;
                this.eventEmitters.rollbackToSavepoint();
            });
    }
    releaseSavepoint () : Promise<void> {
        if (this.savepointData == undefined) {
            return Promise.reject(new Error("Not in savepoint; cannot release savepoint"));
        }
        return this.exec(`RELEASE SAVEPOINT ${this.savepointData.savepointName}`)
            .then(() => {
                this.savepointData = undefined;
                this.eventEmitters.releaseSavepoint();
            });
    }
    private savepointData : (
        | undefined
        | {
            savepointName : string,
        }
    ) = undefined;
    private savepointImpl<ResultT> (
        callback : tsql.LockCallback<tsql.ITransactionConnection & tsql.ConnectionComponent.InSavepoint, ResultT>
    ) : Promise<ResultT> {
        if (this.sharedConnectionInfo.transactionData == undefined) {
            return Promise.reject(new Error(`Cannot use savepoint outside transaction`));
        }
        if (this.savepointData != undefined) {
            return Promise.reject(new Error(`A savepoint is already in progress`));
        }
        const savepointData = {
            savepointName : `tsql_savepoint_${++this.sharedConnectionInfo.savepointId}`,
        };
        this.savepointData = savepointData;
        this.eventEmitters.savepoint();

        return new Promise<ResultT>((resolve, reject) => {
            this.exec(`SAVEPOINT ${savepointData.savepointName}`)
                .then(() => {
                    if (!this.isInTransaction()) {
                        throw new Error(`Expected to be in transaction`);
                    }
                    if (this.savepointData != savepointData) {
                        /**
                         * Why did the savepoint information change?
                         */
                        throw new Error(`Expected to be in savepoint ${savepointData.savepointName}`);
                    }
                    return callback(this as tsql.ITransactionConnection & tsql.ConnectionComponent.InSavepoint);
                })
                .then((result) => {
                    if (!this.isInTransaction()) {
                        /**
                         * `.rollback()` was probably explicitly called
                         */
                        resolve(result);
                        return;
                    }
                    if (this.savepointData == undefined) {
                        /**
                         * `.rollbackToSavepoint()` was probably explicitly called
                         */
                        resolve(result);
                        return;
                    }
                    if (this.savepointData != savepointData) {
                        /**
                         * Some weird thing is going on here.
                         * This should never happen.
                         */
                        reject(new Error(`Expected to be in savepoint ${savepointData.savepointName} or to not be in a savepoint`));
                        return;
                    }

                    this.releaseSavepoint()
                        .then(() => {
                            resolve(result);
                        })
                        .catch((_releaseErr) => {
                            /**
                             * Being unable to release a savepoint isn't so bad.
                             * It usually just means the DBMS cannot reclaim resources
                             * until the transaction ends.
                             *
                             * @todo Do something with `_releaseErr`
                             */
                            resolve(result);
                        });
                })
                .catch((err) => {
                    if (!this.isInTransaction()) {
                        /**
                         * `.rollback()` was probably explicitly called
                         */
                        reject(err);
                        return;
                    }
                    if (this.savepointData == undefined) {
                        /**
                         * `.rollbackToSavepoint()` was probably explicitly called
                         */
                        reject(err);
                        return;
                    }
                    if (this.savepointData != savepointData) {
                        /**
                         * Some weird thing is going on here.
                         * This should never happen.
                         */
                        err.savepointErr = new Error(`Expected to be in savepoint ${savepointData.savepointName} or to not be in a savepoint`);
                        reject(err);
                        return;
                    }

                    this.rollbackToSavepoint()
                        .then(() => {
                            reject(err);
                        })
                        .catch((rollbackToSavepointErr) => {
                            err.rollbackToSavepointErr = rollbackToSavepointErr;
                            reject(err);
                        });
                });
        });
    }
    savepoint<ResultT> (
        callback : tsql.LockCallback<tsql.ITransactionConnection & tsql.ConnectionComponent.InSavepoint, ResultT>
    ) : Promise<ResultT> {
        return this.lock(async (nestedConnection) => {
            return (nestedConnection as unknown as Connection).savepointImpl(
                callback
            );
        });
    }

    private async fetchTableMeta (tableAlias : string) : Promise<tsql.TableMeta> {
        const structure = await this.fetchTableStructure(tableAlias);
        return {
            tableAlias,
            columns : structure.columns.map((column) : tsql.ColumnMeta => {
                return {
                    columnAlias : column.name,
                    isAutoIncrement : column.isAutoIncrement,
                    isNullable : tm.BigIntUtil.equal(column.notnull, tm.BigInt(0)),
                    explicitDefaultValue : typeof column.dflt_value == "string" ?
                        column.dflt_value :
                        undefined,
                    generationExpression : undefined,
                };
            }),
            candidateKeys : structure.candidateKeys,
            primaryKey : structure.primaryKey,
        };
    }

    /**
     * Ignores `schemaAlias` for now.
     */
    async tryFetchSchemaMeta (schemaAlias : string|undefined) : Promise<tsql.SchemaMeta|undefined> {
        const tables = await tsql
            .from(sqlite_master)
            .whereEq(
                columns => columns.type,
                "table"
            )
            .selectValue(columns => columns.name)
            .map((row) => {
                return this.fetchTableMeta(row.sqlite_master.name);
            })
            .fetchAll(this);
        return {
            schemaAlias : schemaAlias == undefined ? "main" : schemaAlias,
            tables,
        };
    }

    tryFetchGeneratedColumnExpression (
        _schemaAlias : string|undefined,
        tableAlias : string,
        columnAlias : string
    ) : Promise<string|undefined> {
        if (columnAlias.startsWith("__GENERATED_COLUMN_HACK__")) {
            /**
             * This lets us test generated columns...
             * Even though SQLite does not support it.
             */
            return Promise.resolve(
                columnAlias.replace("__GENERATED_COLUMN_HACK__", "")
            );
        }
        if (tableAlias == "serverAppKey" && columnAlias == "appKeyTypeId") {
            return Promise.resolve("1");
        }
        if (tableAlias == "browserAppKey" && columnAlias == "appKeyTypeId") {
            return Promise.resolve("2");
        }
        if (tableAlias == "mid" && columnAlias == "generated") {
            return Promise.resolve("9001");
        }
        return Promise.resolve(undefined);
    }
}

export class Pool implements tsql.IPool {
    private readonly worker : ISqliteWorker;
    private readonly idAllocator : IdAllocator;
    private readonly sharedConnectionInfo : SharedConnectionInformation = {
        transactionData : undefined,
        savepointId : 0,
    };
    private readonly asyncQueue : AsyncQueue<Connection>;
    constructor (worker : ISqliteWorker) {
        this.worker = worker;
        this.idAllocator = new IdAllocator();
        this.asyncQueue = new AsyncQueue<Connection>(
            () => {
                const connection = new Connection(
                    this,
                    this.worker,
                    this.idAllocator,
                    this.sharedConnectionInfo,
                    new tsql.ConnectionEventEmitterCollection(this)
                );
                return {
                    item : connection,
                    deallocate : () => {
                        return connection.deallocate();
                    },
                };
            }
        );
        this.acquire = this.asyncQueue.enqueue as AsyncQueue<tsql.IConnection & Connection>["enqueue"];
        this.acquire(async (connection) => {
            await connection.createFunction("bigint_add", (a, b) => {
                if (tm.TypeUtil.isBigInt(a) && tm.TypeUtil.isBigInt(b)) {
                    const result = tm.BigIntUtil.add(a, b);
                    if (tm.BigIntUtil.lessThan(result, BigInt("-9223372036854775808"))) {
                        throw new Error(`DataOutOfRangeError: bigint_add result was ${String(result)}`);
                    }
                    if (tm.BigIntUtil.greaterThan(result, BigInt("9223372036854775807"))) {
                        throw new Error(`DataOutOfRangeError: bigint_add result was ${String(result)}`);
                    }
                    return result;
                } else {
                    throw new Error(`Can only add two bigint values`);
                }
            });
            await connection.createFunction("bigint_sub", (a, b) => {
                if (tm.TypeUtil.isBigInt(a) && tm.TypeUtil.isBigInt(b)) {
                    const result = tm.BigIntUtil.sub(a, b);
                    if (tm.BigIntUtil.lessThan(result, BigInt("-9223372036854775808"))) {
                        throw new Error(`DataOutOfRangeError: bigint_sub result was ${String(result)}`);
                    }
                    if (tm.BigIntUtil.greaterThan(result, BigInt("9223372036854775807"))) {
                        throw new Error(`DataOutOfRangeError: bigint_sub result was ${String(result)}`);
                    }
                    return result;
                } else {
                    throw new Error(`Can only sub two bigint values`);
                }
            });
            await connection.createFunction("bigint_mul", (a, b) => {
                if (tm.TypeUtil.isBigInt(a) && tm.TypeUtil.isBigInt(b)) {
                    const result = tm.BigIntUtil.mul(a, b);
                    if (tm.BigIntUtil.lessThan(result, BigInt("-9223372036854775808"))) {
                        throw new Error(`DataOutOfRangeError: bigint_mul result was ${String(result)}`);
                    }
                    if (tm.BigIntUtil.greaterThan(result, BigInt("9223372036854775807"))) {
                        throw new Error(`DataOutOfRangeError: bigint_mul result was ${String(result)}`);
                    }
                    return result;
                } else {
                    throw new Error(`Can only mul two bigint values`);
                }
            });
            await connection.createFunction("bigint_div", (a, b) => {
                if (tm.TypeUtil.isBigInt(a) && tm.TypeUtil.isBigInt(b)) {
                    if (tm.BigIntUtil.equal(b, tm.BigInt(0))) {
                        throw new Error(`DivideByZeroError: Cannot divide by zero`);
                    }
                    const result = tm.BigIntUtil.div(a, b);
                    if (tm.BigIntUtil.lessThan(result, BigInt("-9223372036854775808"))) {
                        throw new Error(`DataOutOfRangeError: bigint_div result was ${String(result)}`);
                    }
                    if (tm.BigIntUtil.greaterThan(result, BigInt("9223372036854775807"))) {
                        throw new Error(`DataOutOfRangeError: bigint_div result was ${String(result)}`);
                    }
                    return result;
                } else {
                    throw new Error(`Can only div two bigint values`);
                }
            });
            await connection.createFunction("decimal_ctor", (x, precision, scale) => {
                if (
                    tm.TypeUtil.isBigInt(precision) &&
                    tm.TypeUtil.isBigInt(scale)
                ) {
                    if (typeof x == "string") {
                        const parsed = tm.mysql.decimal(precision, scale)("rawDecimal", x);
                        return parsed.toString();
                    } else {
                        throw new Error(`Only string to decimal cast implemented`);
                    }
                } else {
                    throw new Error(`Precision and scale must be bigint`);
                }
            });
            await connection.createFunction("ASCII", (x) => {
                if (typeof x == "string") {
                    if (x == "") {
                        return 0;
                    }
                    return x.charCodeAt(0);
                } else {
                    throw new Error(`ASCII only implemented for string`);
                }
            });
            await connection.createFunction("BIN", (x) => {
                if (tm.TypeUtil.isBigInt(x)) {
                    if (tm.BigIntUtil.greaterThanOrEqual(x, 0)) {
                        return tm.BigIntUtil.toString(
                            x,
                            2
                        );
                    } else {
                        return tm.BigIntUtil.toString(
                            tm.BigIntUtil.add(
                                tm.BigIntUtil.leftShift(tm.BigInt(1), 64),
                                x
                            ),
                            2
                        );
                    }
                } else {
                    throw new Error(`BIN only implemented for bigint`);
                }
            });
            await connection.createVarArgFunction("CONCAT_WS", (separator, ...args) => {
                if (typeof separator == "string") {
                    return args.filter(arg => arg !== null).join(separator);
                } else {
                    throw new Error(`CONCAT_WS only implemented for string`);
                }
            });
            await connection.createFunction("FROM_BASE64", (x) => {
                if (typeof x == "string") {
                    const result = Buffer.from(x, "base64");
                    if (x.toUpperCase() == result.toString("base64").toUpperCase()) {
                        return result;
                    } else {
                        throw new Error(`Invalid Base64 string ${x}`);
                    }
                } else {
                    throw new Error(`FROM_BASE64 only implemented for string`);
                }
            });
            await connection.createFunction("LPAD", (str, len, pad) => {
                if (
                    typeof str == "string" &&
                    tm.TypeUtil.isBigInt(len) &&
                    typeof pad == "string"
                ) {
                    if (str.length > Number(len)) {
                        return str.substr(0, Number(len));
                    } else if (str.length == Number(len)) {
                        return str;
                    } else {
                        return str.padStart(Number(len), pad);
                    }
                } else {
                    throw new Error(`LPAD only implemented for (string, bigint, string)`);
                }
            });
            await connection.createFunction("RPAD", (str, len, pad) => {
                if (
                    typeof str == "string" &&
                    tm.TypeUtil.isBigInt(len) &&
                    typeof pad == "string"
                ) {
                    if (str.length > Number(len)) {
                        return str.substr(0, Number(len));
                    } else if (str.length == Number(len)) {
                        return str;
                    } else {
                        return str.padEnd(Number(len), pad);
                    }
                } else {
                    throw new Error(`RPAD only implemented for (string, bigint, string)`);
                }
            });
            await connection.createFunction("REPEAT", (str, count) => {
                if (
                    typeof str == "string" &&
                    tm.TypeUtil.isBigInt(count)
                ) {
                    if (Number(count) < 0) {
                        return "";
                    }
                    return str.repeat(Number(count));
                } else {
                    throw new Error(`REPEAT only implemented for (string, bigint)`);
                }
            });
            await connection.createFunction("REVERSE", (str) => {
                if (
                    typeof str == "string"
                ) {
                    return [...str].reverse().join("");
                } else {
                    throw new Error(`REVERSE only implemented for (string)`);
                }
            });
            await connection.createFunction("TO_BASE64", (blob) => {
                if (
                    blob instanceof Uint8Array
                ) {
                    return Buffer.from(blob).toString("base64");
                } else {
                    throw new Error(`TO_BASE64 only implemented for (Uint8Array)`);
                }
            });
            await connection.createFunction("UNHEX", (x) => {
                if (typeof x == "string") {
                    const result = Buffer.from(x, "hex");
                    if (x.toUpperCase() == result.toString("hex").toUpperCase()) {
                        return result;
                    } else {
                        throw new Error(`Invalid Hex string ${x}`);
                    }
                } else {
                    throw new Error(`UNHEX only implemented for string`);
                }
            });
        }).then(
            () => {},
            (err) => {
                console.error("Error creating functions", err);
                process.exit(1);
            }
        );
    }

    readonly acquire : AsyncQueue<tsql.IConnection & Connection>["enqueue"];

    acquireTransaction<ResultT> (
        callback : tsql.LockCallback<tsql.ITransactionConnection, ResultT>
    ) : Promise<ResultT>;
    acquireTransaction<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : tsql.LockCallback<tsql.ITransactionConnection, ResultT>
    ) : Promise<ResultT>;
    acquireTransaction<ResultT> (
        ...args : (
            | [tsql.LockCallback<tsql.ITransactionConnection, ResultT>]
            | [IsolationLevel, tsql.LockCallback<tsql.ITransactionConnection, ResultT>]
        )
    ) : Promise<ResultT> {
        return this.acquire((connection) => {
            /**
             * TS has weird narrowing behaviours
             */
            if (args.length == 1) {
                return connection.transaction(...args);
            } else {
                return connection.transaction(...args);
            }
        });
    }

    acquireReadOnlyTransaction<ResultT> (
        callback : tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT>;
    acquireReadOnlyTransaction<ResultT> (
        minimumIsolationLevel : IsolationLevel,
        callback : tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>
    ) : Promise<ResultT>;
    acquireReadOnlyTransaction<ResultT> (
        ...args : (
            | [tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>]
            | [IsolationLevel, tsql.LockCallback<tsql.IsolatedSelectConnection, ResultT>]
        )
    ) : Promise<ResultT> {
        return this.acquire((connection) => {
            /**
             * TS has weird narrowing behaviours
             */
            if (args.length == 1) {
                return connection.readOnlyTransaction(...args);
            } else {
                return connection.readOnlyTransaction(...args);
            }
        });
    }

    disconnect () : Promise<void> {
        return this.asyncQueue.stop()
            .then(
                () => this.worker.postMessage({
                    id : this.idAllocator.allocateId(),
                    action : SqliteAction.CLOSE,
                }),
                () => this.worker.postMessage({
                    id : this.idAllocator.allocateId(),
                    action : SqliteAction.CLOSE,
                })
            );
    }
    isDeallocated () {
        return this.asyncQueue.getShouldStop();
    }

    readonly onInsert = new PoolEventEmitter<tsql.IInsertEvent<ITable>>();
    readonly onInsertOne = new PoolEventEmitter<tsql.IInsertOneEvent<ITable>>();
    readonly onInsertAndFetch = new PoolEventEmitter<tsql.IInsertAndFetchEvent<ITable>>();
    readonly onInsertSelect = new PoolEventEmitter<tsql.IInsertSelectEvent<ITable>>();

    readonly onReplace = new PoolEventEmitter<tsql.IReplaceEvent<ITable>>();
    readonly onReplaceOne = new PoolEventEmitter<tsql.IReplaceOneEvent<ITable>>();
    readonly onReplaceSelect = new PoolEventEmitter<tsql.IReplaceSelectEvent<ITable>>();

    readonly onUpdate = new PoolEventEmitter<tsql.IUpdateEvent<ITable>>();
    readonly onUpdateAndFetch = new PoolEventEmitter<tsql.IUpdateAndFetchEvent<ITable>>();

    readonly onDelete = new PoolEventEmitter<tsql.IDeleteEvent<ITable>>();
}
