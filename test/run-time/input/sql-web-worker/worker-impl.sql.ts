/**
 * The web worker implementation from `sql.js` is... Not great.
 * We write our own, to preserve a little more sanity.
 */
import * as sql from "../sql.js/sql";
import {FromSqliteMessage, ToSqliteMessage, SqliteAction} from "./worker.sql";

export function initWorker (
    postMessage : (data : FromSqliteMessage) => void
) {
    let sqlite : sql.Sqlite|undefined = undefined;
    let dbInstance : sql.Database|undefined = undefined;
    const getSqlite = async () : Promise<sql.Sqlite> => {
        if (sqlite == undefined) {
            sqlite = await sql.initSqlJs();
        }
        return sqlite;
    };
    const createDb = async (dbFile? : Uint8Array) : Promise<sql.Database> => {
        if (dbInstance != undefined) {
            dbInstance.close();
        }
        dbInstance = undefined;
        dbInstance = new (await getSqlite()).Database(dbFile);
        return dbInstance;
    };
    const getOrCreateDb = async () : Promise<sql.Database> => {
        if (dbInstance == undefined) {
            dbInstance = await createDb();
        }
        return dbInstance;
    };
    const closeDb = async () : Promise<void> => {
        if (dbInstance == undefined) {
            return;
        }
        dbInstance.close();
        dbInstance = undefined;
    };

    const processMessage = async (data : ToSqliteMessage) => {
        switch (data.action) {
            case SqliteAction.OPEN: {
                await createDb(data.buffer);
                postMessage({
                    id : data.id,
                    action : data.action,
                });
                return;
            }
            case SqliteAction.EXEC: {
                const db = await getOrCreateDb();
                const execResult = db.exec(data.sql);
                postMessage({
                    id : data.id,
                    action : data.action,
                    execResult,
                    rowsModified : db.getRowsModified(),
                });
                return;
            }
            case SqliteAction.EXPORT: {
                const db = await getOrCreateDb();
                postMessage({
                    id : data.id,
                    action : data.action,
                    buffer : db.export(),
                });
                return;
            }
            case SqliteAction.CLOSE: {
                await closeDb();
                postMessage({
                    id : data.id,
                    action : data.action,
                });
                return;
            }
            case SqliteAction.CREATE_FUNCTION: {
                const db = await getOrCreateDb();
                db.create_function(
                    data.functionName,
                    /**
                     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator
                     *
                     * https://github.com/webpack/webpack/issues/9615#issuecomment-524167958
                     *
                     * According to https://github.com/fatcerberus,
                     *
                     * > Per spec the JS engine looks specifclaly for `eval(...` to trigger direct eval (inherits containing scope)
                     * >
                     * > `(0, eval)` bypasses it
                     * >
                     * > Indirect eval ensures you only inherit the global scope
                     * >
                     * > In case it wasn't clear the `0` can be anything you want
                     * >
                     * > But `0` is most concise
                     *
                     * ```js
                     *  function bar () {
                     *      const x = 4
                     *      eval("console.log(x)") //prints 4
                     *      (0, eval)("console.log(x)") //Uncaught TypeError: eval(...) is not a function
                     *  }
                     *  bar()
                     * ```
                     *
                     * ```js
                     *  function bar () {
                     *      const x = 4
                     *      eval("console.log(x)") //prints 4
                     *      const indirectEval = eval;
                     *      indirectEval("console.log(x)") //Uncaught TypeError: eval(...) is not a function
                     *  }
                     *  bar()
                     * ```
                     */
                    (0, eval)("(" + data.impl + ")")
                );
                postMessage({
                    id : data.id,
                    action : data.action,
                });
                return;
            }
            default: {
                /**
                 * Explicitly check we have handled every case.
                 */
                const neverVar : never = data;
                const tmp : ToSqliteMessage = neverVar as ToSqliteMessage;
                postMessage({
                    id : tmp.id,
                    action : tmp.action,
                    error : `Unknown action ${tmp.action}`,
                });
                return;
            }
        }
    };
    return (data : ToSqliteMessage) => {
        processMessage(data)
            .catch((error) => {
                postMessage({
                    id : data.id,
                    action : data.action,
                    error : (
                        error == undefined ?
                        "An unknown error occurred" :
                        typeof error.message == "string" ?
                        error.message :
                        "An unexpected error occurred"
                    ),
                });
            });
    }
}
