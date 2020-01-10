import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {createAppKeyTableSql, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        await serverAppKeyTpt.deleteOneBySuperKey(
            connection,
            {
                appKeyId : BigInt(1),
            }
        ).then(() => {
            t.fail("Should not delete anything");
        }).catch((err) => {
            t.true(err instanceof tsql.RowNotFoundError);
        });
    });

    await pool.disconnect();t.end();
});
