import * as tape from "tape";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {createAppKeyTableSql, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        await serverAppKeyTpt.updateAndFetchZeroOrOneByPrimaryKey(
            connection,
            {
                appKeyId : BigInt(1),
            },
            () => {
                return {
                    ipAddress : "ip2",
                    trustProxy : true,
                    key : "server2",
                    disabledAt : new Date(4),
                };
            }
        ).then((result) => {
            t.deepEqual(result.row, undefined);
        });
    });

    await pool.disconnect();
    t.end();
});
