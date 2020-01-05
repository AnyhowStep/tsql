import * as tape from "tape";
import * as tsql from "../../../../../../../dist";
import {Pool} from "../../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../../sql-web-worker/worker.sql";
import {createAppKeyTableSql, serverAppKeyTpt} from "../../../../design-pattern-table-per-type/app-key-example";

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
            ++handlerInvoked;

            evt.addOnCommitListener(() => {
                t.deepEqual(handlerInvoked, 3);
                t.deepEqual(rollbackInvoked, 0);
                ++commitInvoked;
            });

            evt.addOnRollbackListener(() => {
                t.fail("Should not invoke rollback listener");
                ++rollbackInvoked;
            });
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

                t.deepEqual(handlerInvoked, 3);
                t.deepEqual(commitInvoked, 0);
                t.deepEqual(rollbackInvoked, 0);

                await specialServerAppKey.existsByPrimaryKey(
                    connection,
                    {
                        appKeyId : BigInt(1),
                    }
                ).then((result) => {
                    t.deepEqual(result, true);
                });
            });

            t.deepEqual(handlerInvoked, 3);
            t.deepEqual(commitInvoked, 0);
            t.deepEqual(rollbackInvoked, 0);

        });
        t.deepEqual(handlerInvoked, 3);
        t.deepEqual(commitInvoked, 3);
        t.deepEqual(rollbackInvoked, 0);

        await specialServerAppKey.existsByPrimaryKey(
            connection,
            {
                appKeyId : BigInt(1),
            }
        ).then((result) => {
            t.deepEqual(result, true);
        });
    });

    t.end();
});
