import * as tape from "tape";
import * as tsql from "../../../../../../../dist";
import {Pool} from "../../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../../sql-web-worker/worker.sql";
import {createAppKeyTableSql, serverAppKeyTpt, serverAppKey, appKey} from "../../../../design-pattern-table-per-type/app-key-example";

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
        pool.onInsertAndFetch.addHandler(async (evt) => {
            if (!evt.isFor(appKey)) {
                if (evt.isFor(serverAppKey)) {
                    t.deepEqual(handlerInvoked, 1);
                } else {
                    t.fail("Should only be invoked for appKey or serverAppKey");
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

            await serverAppKey.insertAndFetch(
                evt.connection,
                {
                    appKeyId: BigInt(1),
                    ipAddress : "ip",
                    trustProxy : false,
                }
            );
        });

        await connection.transaction(async (connection) => {
            await connection.savepoint(async (connection) => {
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
                ).then(() => {
                    t.fail("Should not fetch more than one row");
                }).catch((err) => {
                    t.true(err instanceof tsql.TooManyRowsFoundError);
                });

                t.deepEqual(handlerInvoked, 1);
                t.deepEqual(commitInvoked, 0);
                t.deepEqual(rollbackInvoked, 1);

                await specialServerAppKey.existsByPrimaryKey(
                    connection,
                    {
                        appKeyId : BigInt(1),
                    }
                ).then((result) => {
                    t.deepEqual(result, false);
                });
            });

            t.deepEqual(handlerInvoked, 1);
            t.deepEqual(commitInvoked, 0);
            t.deepEqual(rollbackInvoked, 1);

        });

        t.deepEqual(handlerInvoked, 1);
        t.deepEqual(commitInvoked, 0);
        t.deepEqual(rollbackInvoked, 1);

        await specialServerAppKey.existsByPrimaryKey(
            connection,
            {
                appKeyId : BigInt(1),
            }
        ).then((result) => {
            t.deepEqual(result, false);
        });
    });

    t.end();
});
