import * as tape from "tape";
import * as tsql from "../../../../../dist";
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
                key : "server",
                createdAt : new Date(1),
                disabledAt : new Date(2),
                ipAddress : "ip",
                trustProxy : false,
            }
        ).then((insertResult) => {
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
        });

        await serverAppKeyTpt.fetchOne(
            connection,
            (columns) => tsql.eq(
                columns.serverAppKey.appKeyId,
                BigInt(1)
            )
        ).orUndefined(
        ).then((fetchOneResult) => {
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
        });


        await serverAppKeyTpt.updateAndFetchOneByPrimaryKey(
            connection,
            {
                appKeyId : BigInt(1),
            },
            columns => {
                return {
                    ipAddress : tsql.concat(
                        tsql.coalesce(columns.serverAppKey.ipAddress, ""),
                        "-x"
                    ),
                    trustProxy : tsql.not(columns.serverAppKey.trustProxy),
                    key : tsql.concat(
                        tsql.coalesce(columns.serverAppKey.ipAddress, ""),
                        "-",
                        columns.appKey.key,
                        "-y"
                    ),
                    disabledAt : tsql.timestampAddMillisecond(
                        tsql.coalesce(
                            columns.appKey.disabledAt,
                            new Date(0)
                        ),
                        5
                    ),
                };
            }
        ).then((updateAndFetchOneResult) => {
            //console.log(updateAndFetchOneResult.updateOneResults);
            t.deepEqual(
                updateAndFetchOneResult.row,
                {
                    appKeyId: BigInt(1),
                    appKeyTypeId: BigInt(1),
                    ipAddress : "ip-x",
                    trustProxy : true,
                    appId: BigInt(1),
                    key: "ip-server-y",
                    createdAt: new Date(1),
                    disabledAt: new Date(7),
                }
            );
        });

    });

    await pool.disconnect();t.end();
});
