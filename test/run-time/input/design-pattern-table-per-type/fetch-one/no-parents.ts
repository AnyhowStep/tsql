import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {appKey, createAppKeyTableSql, appKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const fetchOneResult = await pool.acquire(async (connection) => {
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
            (columns) => tsql.eq(
                columns.appKeyId,
                BigInt(1)
            )
        );
    });

    t.deepEqual(
        fetchOneResult,
        {
            appKeyId: BigInt(1),
            appKeyTypeId: BigInt(1),
            appId: BigInt(1),
            key: "server",
            createdAt: new Date(1),
            disabledAt: new Date(2),
        }
    );

    t.end();
});
