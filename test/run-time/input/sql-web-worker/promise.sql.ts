import * as tm from "type-mapping";
import * as tsql from "../../../../dist";
import {ISqliteWorker, SqliteAction, FromSqliteMessage, ToSqliteMessage} from "./worker.sql";
import {AsyncQueue} from "../../../../dist";
import {sqliteSqlfier} from "../../../sqlite-sqlfier";
import {ITable, BuiltInExprUtil, WhereClause, DeletableTable, DeleteResult, BuiltInAssignmentMap, UpdateResult} from "../../../../dist";

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

interface TransactionInformation {
    /**
     * mutable
     */
    isInTransaction : boolean;
}

/**
 * Only one operation can be running at any point in time.
 */
export class Connection {
    private readonly idAllocator : IdAllocator;
    private readonly asyncQueue : AsyncQueue<ISqliteWorker>;
    private readonly transactionInfo : TransactionInformation;

    constructor (
        worker : ISqliteWorker|AsyncQueue<ISqliteWorker>,
        idAllocator : IdAllocator,
        transactionInfo : TransactionInformation
    ) {
        this.idAllocator = idAllocator;
        this.transactionInfo = transactionInfo;

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
    deallocate () {
        return this.asyncQueue.stop();
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
        callback : tsql.LockCallback<ResultT>
    ) : Promise<ResultT> {
        return this.asyncQueue.lock((nestedAsyncQueue) => {
            const nestedConnection = new Connection(
                nestedAsyncQueue,
                this.idAllocator,
                this.transactionInfo
            );
            return callback(
                nestedConnection as unknown as tsql.IConnection
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
                })
                .catch((err) => {
                    //console.error("error encountered", sql);
                    throw err;
                });
        });
    }

    replaceOne<TableT extends ITable> (table : TableT, row : tsql.BuiltInInsertRow<TableT>) : Promise<tsql.ReplaceOneResult> {
        const sql = this.insertOneSqlString(table, row, "OR REPLACE");
        return this.exec(sql)
            .then(async (result) => {
                if (result.execResult.length != 0) {
                    throw new Error(`replaceOne() should have no result set; found ${result.execResult.length}`);
                }
                if (result.rowsModified != 1) {
                    throw new Error(`replaceOne() should modify one row`);
                }

                const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

                return {
                    query : { sql, },
                    insertedOrReplacedRowCount : BigInt(1) as 1n,
                    warningCount : BigInt(0),
                    message : "ok",
                };
            })
            .catch((err) => {
                //console.error("error encountered", sql);
                throw err;
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
                            warningCount : BigInt(0),
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
        const sql = await sqlite_master.fetchValueByPrimaryKey(
            this,
            {
                name : tableName,
            },
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
        return this.exec(sql)
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
    }

    async insertIgnoreMany<TableT extends ITable> (
        table : TableT,
        rows : readonly [tsql.BuiltInInsertRow<TableT>, ...tsql.BuiltInInsertRow<TableT>[]]
    ) : Promise<tsql.InsertIgnoreManyResult> {
        const sql = await this.insertManySqlString(table, rows, "OR IGNORE");
        return this.exec(sql)
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
        QueryT extends tsql.QueryBaseUtil.AfterSelectClause,
        TableT extends tsql.InsertableTable
    > (
        query : QueryT,
        table : TableT,
        row : tsql.InsertSelectRow<QueryT, TableT>
    ) : Promise<tsql.InsertManyResult> {
        const sql = await this.insertSelectSqlString(query, table, row, "");
        return this.exec(sql)
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
    }

    async insertIgnoreSelect<
        QueryT extends tsql.QueryBaseUtil.AfterSelectClause,
        TableT extends tsql.InsertableTable
    > (
        query : QueryT,
        table : TableT,
        row : tsql.InsertSelectRow<QueryT, TableT>
    ) : Promise<tsql.InsertIgnoreManyResult> {
        const sql = await this.insertSelectSqlString(query, table, row, "OR IGNORE");
        return this.exec(sql)
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
                    warningCount : BigInt(0),
                    message : "ok",
                };
            })
            .catch((err) => {
                //console.error("error encountered", sql);
                throw err;
            });
    }

    async replaceSelect<
        QueryT extends tsql.QueryBaseUtil.AfterSelectClause,
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
                this.transactionInfo.isInTransaction = false;
            });
    }
    commit () : Promise<void> {
        if (!this.isInTransaction()) {
            return Promise.reject(new Error("Not in transaction; cannot commit"));
        }
        return this.exec("COMMIT")
            .then(() => {
                this.transactionInfo.isInTransaction = false;
            });
    }

    isInTransaction () : this is tsql.ITransactionConnection {
        return this.transactionInfo.isInTransaction;
    }
    private transactionImpl<ResultT> (
        callback : tsql.TransactionCallback<ResultT>
    ) : Promise<ResultT> {
        if (this.transactionInfo.isInTransaction) {
            return Promise.reject(new Error(`Transaction already started`));
        }
        this.transactionInfo.isInTransaction = true;

        return new Promise<ResultT>((resolve, reject) => {
            this.exec("BEGIN TRANSACTION")
                .then(() => {
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
    transaction<ResultT> (
        callback : tsql.TransactionCallback<ResultT>
    ) : Promise<ResultT> {
        return this.lock(async (nestedConnection) => {
            return (nestedConnection as unknown as Connection).transactionImpl(callback);
        });
    }
    transactionIfNotInOne<ResultT> (
        callback : tsql.TransactionCallback<ResultT>
    ) : Promise<ResultT> {
        return this.lock(async (nestedConnection) => {
            if (nestedConnection.isInTransaction()) {
                try {
                    return callback(nestedConnection);
                } catch (err) {
                    return Promise.reject(err);
                }
            } else {
                return (nestedConnection as unknown as Connection).transactionImpl(callback);
            }
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
        return Promise.resolve(undefined);
    }
}

/**
 * Only one connection can be allocated at any point in time.
 */
export class Pool {
    private readonly worker : ISqliteWorker;
    private readonly idAllocator : IdAllocator;
    private readonly transactionInfo : TransactionInformation = {
        isInTransaction : false,
    };
    private readonly asyncQueue : AsyncQueue<Connection>;
    constructor (worker : ISqliteWorker) {
        this.worker = worker;
        this.idAllocator = new IdAllocator();
        this.asyncQueue = new AsyncQueue<Connection>(
            () => {
                const connection = new Connection(this.worker, this.idAllocator, this.transactionInfo);
                return {
                    item : connection,
                    deallocate : () => {
                        return connection.deallocate();
                    },
                };
            }
        );
        this.acquire = this.asyncQueue.enqueue;
    }

    readonly acquire : AsyncQueue<Connection>["enqueue"];
    disconnect () : Promise<void> {
        return this.asyncQueue.stop();
    }
}
