import * as tape from "tape";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {createAppKeyTableSql, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        await serverAppKeyTpt.insertAndFetch(
            connection,
            {
                appId : BigInt(1),
                createdAt : new Date(1),
                disabledAt : new Date(2),
                ipAddress : "ip",
                trustProxy : false,
            } as any
        ).then(() => {
            t.fail("Should not insert");
        }).catch((err) => {
            t.pass(err.message);
        });
    });

    await pool.disconnect();
    t.end();
});
