import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquireReadOnlyTransaction(async (connection) => {
        t.deepEqual(connection.isInTransaction(), true);
        t.deepEqual(connection.getMinimumIsolationLevel(), tsql.IsolationLevel.SERIALIZABLE);
        t.deepEqual(connection.getTransactionAccessMode(), tsql.TransactionAccessMode.READ_ONLY);

        await (connection as unknown as tsql.IConnection).transactionIfNotInOne(async () => {
            t.fail("Cannot go from READ_ONLY to READ_WRITE");
        }).catch((err) => {
            t.deepEqual(
                err.message,
                `Current transaction access mode is ${tsql.TransactionAccessMode.READ_ONLY}; cannot allow ${tsql.TransactionAccessMode.READ_WRITE}`
            );
        });
    });

    await pool.disconnect();
    t.end();
});
