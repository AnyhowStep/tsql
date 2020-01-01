import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquireTransaction(tsql.IsolationLevel.READ_UNCOMMITTED, async (connection) => {
        t.deepEqual(connection.isInTransaction(), true);
        t.deepEqual(connection.getMinimumIsolationLevel(), tsql.IsolationLevel.READ_UNCOMMITTED);
        t.deepEqual(connection.getTransactionAccessMode(), tsql.TransactionAccessMode.READ_WRITE);

        await connection.transactionIfNotInOne(async () => {
            t.fail("Expected to fail");
        })
        .then(() => {
            t.fail("Expected to fail");
        })
        .catch((err) => {
            t.deepEqual(
                err.message,
                `Current isolation level is ${tsql.IsolationLevel.READ_UNCOMMITTED}; cannot guarantee ${tsql.IsolationLevel.SERIALIZABLE}`
            );
        });
    });

    t.end();
});
