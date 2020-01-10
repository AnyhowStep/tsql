import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {appKey, createAppKeyTableSql, serverAppKey, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const fetchOneResult = await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        const serverBase = await appKey.insertOne(
            connection,
            {
                appId : BigInt(1),
                appKeyTypeId : BigInt(1) as 1n,
                key : "server",
                createdAt : new Date(1),
                disabledAt : new Date(2),
            }
        );
        await serverAppKey.insertOne(
            connection,
            {
                appKeyId : serverBase.appKeyId,
                ipAddress : "ip",
                trustProxy : false,
            }
        );

        return serverAppKeyTpt.fetchOne(
            connection,
            (columns) => tsql.eq(
                columns.serverAppKey.appKeyId,
                BigInt(1)
            )
        ).orUndefined();
    });

    t.deepEqual(
        tsql.TablePerTypeUtil.rowMapper(serverAppKeyTpt)("", fetchOneResult),
        {
            appKeyId: BigInt(1),
            appKeyTypeId: BigInt(1),
            ipAddress : "ip",
            trustProxy : false,
            appId: BigInt(1),
            key: "server",
            createdAt: new Date(1),
            disabledAt: new Date(2),
        }
    );

    await pool.disconnect();
    t.end();
});
