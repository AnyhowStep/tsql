import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const dst = tsql.table("dst")
        .addColumns({
            testId : tsql.dtBigIntSigned(),
            testVal : tsql.dtBigIntSigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    await pool.acquire(async (connection) => {
        await connection.rawQuery(`
            CREATE TABLE dst (
                testId INT PRIMARY KEY,
                testVal INT
            );

            INSERT INTO dst(testId, testVal) VALUES
                (1,100),
                (2,200),
                (3,300);
        `);

        return connection.transaction(async (connection) => {
            let handlerInvoked = false;
            let commitInvoked = false;
            let rollbackInvoked = false;

            await connection.savepoint(async (connection) => {
                const myDeleteHandler : tsql.EventHandler<tsql.IDeleteEvent<tsql.ITable>> = (evt) => {
                    t.deepEqual(handlerInvoked, false);
                    handlerInvoked = true;

                    evt.addOnCommitListener(() => {
                        t.fail("Should not invoke commit listener");
                        commitInvoked = true;
                    });

                    evt.addOnRollbackListener(() => {
                        t.deepEqual(rollbackInvoked, false);
                        rollbackInvoked = true;
                    });
                };
                pool.onDelete.addHandler(myDeleteHandler);
                /**
                 * This should delete exactly one row.
                 */
                await dst.deleteZeroOrOne(
                    connection,
                    columns => tsql.eq(
                        columns.testVal,
                        BigInt(200)
                    )
                );
                t.deepEqual(handlerInvoked, true);
                t.deepEqual(commitInvoked, false);
                t.deepEqual(rollbackInvoked, false);

                throw new Error(`Blah`);
            }).catch((err) => {

                t.deepEqual(handlerInvoked, true);
                t.deepEqual(commitInvoked, false);
                t.deepEqual(rollbackInvoked, true);

                t.deepEqual(err.message, `Blah`);
            });

            t.deepEqual(handlerInvoked, true);
            t.deepEqual(commitInvoked, false);
            t.deepEqual(rollbackInvoked, true);

            await tsql.from(dst)
                .select(columns => [columns])
                .orderBy(columns => [
                    columns.testId.asc(),
                ])
                .fetchAll(connection)
                .then((rows) => {
                    t.deepEqual(
                        rows,
                        [
                            {
                                testId : BigInt(1),
                                testVal : BigInt(100),
                            },
                            {
                                testId : BigInt(2),
                                testVal : BigInt(200),
                            },
                            {
                                testId : BigInt(3),
                                testVal : BigInt(300),
                            },
                        ]
                    );
                });
        });
    });

    await pool.disconnect();
    t.end();
});
