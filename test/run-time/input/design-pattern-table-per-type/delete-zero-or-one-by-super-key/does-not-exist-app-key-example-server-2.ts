import * as tape from "tape";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {createAppKeyTableSql, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        await serverAppKeyTpt.deleteZeroOrOneBySuperKey(
            connection,
            {
                appKeyId : BigInt(1),
                key : "someKey",
            }
        ).then((deleteResult) => {
            t.deepEqual(deleteResult.deleteOneResults, undefined);
            t.deepEqual(deleteResult.deletedRowCount, BigInt(0));
        });
    });

    t.end();
});
