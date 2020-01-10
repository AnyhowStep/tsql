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
        /**
         * This will cause the `deleteOne` operation
         * to delete two rows from `serverAppkey()`
         */
        await serverAppKey.insertOne(
            connection,
            {
                appKeyId: BigInt(1),
                ipAddress : "ip2",
                trustProxy : false,
            }
        );

        await specialServerAppKeyTpt.deleteOneByPrimaryKey(
            connection,
            {
                appKeyId : BigInt(1),
            }
        ).then(() => {
            t.fail("Should not delete more than one");
        }).catch((err) => {
            t.true(err instanceof tsql.TooManyRowsFoundError);
        });

        await specialServerAppKey.fetchOneByPrimaryKey(
            connection,
            {
                appKeyId : BigInt(1),
            }
        ).then((row) => {
            t.deepEqual(row, {
                appKeyId : BigInt(1),
            });
        });
    });

    await pool.disconnect();
    t.end();
});
