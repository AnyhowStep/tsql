import * as tape from "tape";
import * as tsql from "../../../../../../../dist";
import {Pool} from "../../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../../sql-web-worker/worker.sql";
import {createAppKeyTableSql, serverAppKeyTpt, serverAppKey} from "../../../../design-pattern-table-per-type/app-key-example";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.rawQuery(createAppKeyTableSql);
        await connection.rawQuery(`
            CREATE TABLE specialServerAppKey (
                appKeyId INTEGER NOT NULL,
                FOREIGN KEY (appKeyId) REFERENCES serverAppKey (appKeyId)
            );
        `);

        const specialServerAppKey = tsql.table("specialServerAppKey")
            .addColumns({
                appKeyId : tsql.dtBigIntSigned(),
            })
            .setId(columns => columns.appKeyId);
        const specialServerAppKeyTpt = tsql.tablePerType(specialServerAppKey)
            .addParent(serverAppKeyTpt);

        let handlerInvoked = 0;
        let commitInvoked = 0;
        let rollbackInvoked = 0;
        pool.onUpdateAndFetch.addHandler(async (evt) => {
            if (!evt.isFor(specialServerAppKey)) {
                if (evt.isFor(serverAppKey)) {
                    t.deepEqual(handlerInvoked, 1);
                } else {
                    t.fail("Should only be invoked for specialServerAppKey or serverAppKey");
                }
                return;
            }
            ++handlerInvoked;

            evt.addOnCommitListener(() => {
                t.fail("Should not invoke commit listener");
                ++commitInvoked;
            });

            evt.addOnRollbackListener(() => {
                t.deepEqual(handlerInvoked, 1);
                t.deepEqual(rollbackInvoked, 0);
                ++rollbackInvoked;
            });

            /**
             * This will cause the next `updateAndFetchZeroOrOne()` to update
             * two rows, and throw an error.
             */
            await serverAppKey.insertOne(
                evt.connection,
                {
                    appKeyId : BigInt(1),
                }
            );
        });

        await specialServerAppKeyTpt.insertAndFetch(
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

        await connection.transaction(async (connection) => {
            await specialServerAppKeyTpt.updateAndFetchZeroOrOneByPrimaryKey(
                connection,
                {
                    appKeyId: BigInt(1),
                },
                () => {
                    return {
                        ipAddress : "ip-updated",
                    };
                }
            ).then(() => {
                t.fail("Should not succeed");
            }).catch((err) => {
                t.true(err instanceof tsql.TooManyRowsFoundError);
            });

            t.deepEqual(handlerInvoked, 1);
            t.deepEqual(commitInvoked, 0);
            t.deepEqual(rollbackInvoked, 1);

            await specialServerAppKeyTpt.fetchOne(
                connection,
                () => tsql.eqPrimaryKey(
                    specialServerAppKey,
                    {
                        appKeyId: BigInt(1),
                    }
                )
            ).then((result) => {
                t.deepEqual(
                    result,
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
        });

        await specialServerAppKeyTpt.fetchOne(
            connection,
            () => tsql.eqPrimaryKey(
                specialServerAppKey,
                {
                    appKeyId: BigInt(1),
                }
            )
        ).then((result) => {
            t.deepEqual(
                result,
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
    });

    await pool.disconnect();
    t.end();
});
