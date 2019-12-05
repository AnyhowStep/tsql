import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {appKey, createAppKeyTableSql, appKeyTpt, serverAppKey} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        await appKey.insertOne(
            connection,
            {
                appId : BigInt(1),
                appKeyTypeId : BigInt(1) as 1n,
                key : "server",
                createdAt : new Date(1),
                disabledAt : new Date(2),
            }
        );

        return appKeyTpt.fetchOne(
            connection,
            () => tsql.eq(
                serverAppKey.columns.appKeyId,
                BigInt(1)
            ) as any
        ).or(
            "not-found"
        ).then(() => {
            t.fail("Should have error");
        }).catch((err) => {
            t.false(err instanceof tsql.RowNotFoundError);
            t.true(err instanceof Error);
        });
    });

    t.end();
});
