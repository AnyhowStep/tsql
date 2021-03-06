import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {createAppKeyTableSql, serverAppKeyTpt} from "../app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const {
        fetchOneResult,
        createdAt,
    } = await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        const insertResult = await serverAppKeyTpt.insertAndFetch(
            connection,
            {
                appId : BigInt(1),
                key : "server",
                ipAddress : null,
                disabledAt: null,
            }
        );

        t.deepEqual(
            {
                ...insertResult,
                createdAt : undefined,
            },
            {
                appKeyId: BigInt(1),
                appKeyTypeId: BigInt(1),
                ipAddress : null,
                trustProxy : false,
                appId: BigInt(1),
                key: "server",
                disabledAt: null,
                createdAt: undefined,
            }
        );

        t.true(insertResult.createdAt instanceof Date);

        return {
            fetchOneResult : await serverAppKeyTpt.fetchOne(
                connection,
                (columns) => tsql.eq(
                    columns.serverAppKey.appKeyId,
                    BigInt(1)
                )
            ).orUndefined(),
            createdAt : insertResult.createdAt,
        };
    });

    t.deepEqual(
        fetchOneResult,
        {
            appKeyId: BigInt(1),
            appKeyTypeId: BigInt(1),
            ipAddress : null,
            trustProxy : false,
            appId: BigInt(1),
            key: "server",
            disabledAt: null,
            createdAt,
        }
    );

    await pool.disconnect();
    t.end();
});
