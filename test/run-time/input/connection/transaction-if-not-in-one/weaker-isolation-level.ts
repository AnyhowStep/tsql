import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquireTransaction(async (connection) => {
        t.deepEqual(connection.isInTransaction(), true);
        t.deepEqual(connection.getMinimumIsolationLevel(), tsql.IsolationLevel.SERIALIZABLE);
        t.deepEqual(connection.getTransactionAccessMode(), tsql.TransactionAccessMode.READ_WRITE);

        await connection.transactionIfNotInOne(tsql.IsolationLevel.READ_UNCOMMITTED, async (connection) => {
            t.deepEqual(connection.isInTransaction(), true);
            /**
             * Even though we asked for `READ_UNCOMMITTED`,
             * the actual "real" isolation level is `SERIALIZABLE`.
             *
             * We do not want to change that.
             */
            t.deepEqual(connection.getMinimumIsolationLevel(), tsql.IsolationLevel.SERIALIZABLE);
            t.deepEqual(connection.getTransactionAccessMode(), tsql.TransactionAccessMode.READ_WRITE);
        });
    });

    await pool.disconnect();
    t.end();
});
