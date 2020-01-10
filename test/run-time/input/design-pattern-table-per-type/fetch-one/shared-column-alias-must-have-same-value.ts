import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {appKey, browserAppKey, browserAppKeyTpt, createAppKeyTableSql} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        const browserBase = await appKey.insertOne(
            connection,
            {
                appId : BigInt(1),
                appKeyTypeId : BigInt(1) as 1n,
                key : "browser",
                createdAt : new Date(0),
            }
        );
        await browserAppKey.insertOne(
            connection,
            {
                appKeyId : browserBase.appKeyId,
            }
        );

        const p = browserAppKeyTpt.fetchOne(
            connection,
            (columns) => tsql.eq(
                columns.browserAppKey.appKeyId,
                BigInt(1)
            )
        );
        return p.then(() => {
            t.fail("Should not fetch because appKeyTypeId should have different values");
        }).catch((err) => {
            t.pass(err.message);
        });
    });

    await pool.disconnect();t.end();
});
