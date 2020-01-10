import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {createAppKeyTableSql, serverAppKey, appKey} from "../app-key-example";

export const serverAppKeyTpt = tsql.tablePerType(serverAppKey)
    .addParent(
        appKey
            .enableExplicitAutoIncrementValue()
    );

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const fetchOneResult = await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        const insertResult = await serverAppKeyTpt.insertAndFetch(
            connection,
            {
                appId : BigInt(1),
                appKeyId : BigInt(1337),
                key : "server",
                createdAt : new Date(1),
                disabledAt : new Date(2),
                ipAddress : "ip",
                trustProxy : false,
            }
        );

        t.deepEqual(
            insertResult,
            {
                appKeyId : BigInt(1337),
                appKeyTypeId: BigInt(1),
                ipAddress : "ip",
                trustProxy : false,
                appId: BigInt(1),
                key: "server",
                createdAt: new Date(1),
                disabledAt: new Date(2),
            }
        );

        return serverAppKeyTpt.fetchOne(
            connection,
            (columns) => tsql.eq(
                columns.serverAppKey.appKeyId,
                BigInt(1337)
            )
        ).orUndefined();
    });

    t.deepEqual(
        fetchOneResult,
        {
            appKeyId : BigInt(1337),
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

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const fetchOneResult = await pool.acquire(async (connection) => {
        await connection.exec(createAppKeyTableSql);

        const insertResult = await serverAppKeyTpt.insertAndFetch(
            connection,
            {
                appId : BigInt(1),
                key : "server",
                createdAt : new Date(1),
                disabledAt : new Date(2),
                ipAddress : "ip",
                trustProxy : false,
            }
        );

        t.deepEqual(
            insertResult,
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

        return serverAppKeyTpt.fetchOne(
            connection,
            (columns) => tsql.eq(
                columns.serverAppKey.appKeyId,
                BigInt(1)
            )
        ).orUndefined();
    });

    t.deepEqual(
        fetchOneResult,
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
