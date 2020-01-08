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

        let handlerInvoked = false;
        let commitInvoked = false;
        let rollbackInvoked = false;
        const myDeleteHandler : tsql.EventHandler<tsql.IDeleteEvent<tsql.ITable>> = (evt) => {
            t.deepEqual(handlerInvoked, false);
            handlerInvoked = true;

            evt.addOnCommitListener(() => {
                t.deepEqual(commitInvoked, false);
                commitInvoked = true;
            });

            evt.addOnRollbackListener(() => {
                t.fail("Should not invoke rollback listener");
                rollbackInvoked = true;
            });
        };
        pool.onDelete.addHandler(myDeleteHandler);

        await connection.transaction(async (connection) => {
            await connection.savepoint(async (connection) => {
                await dst.deleteOne(
                    connection,
                    columns => tsql.eq(
                        columns.testVal,
                        BigInt(200)
                    )
                );
                t.deepEqual(handlerInvoked, true);
                t.deepEqual(commitInvoked, false);
                t.deepEqual(rollbackInvoked, false);
            });
            t.deepEqual(handlerInvoked, true);
            t.deepEqual(commitInvoked, false);
            t.deepEqual(rollbackInvoked, false);

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
                                testId : BigInt(3),
                                testVal : BigInt(300),
                            },
                        ]
                    );
                });
        });
        t.deepEqual(handlerInvoked, true);
        t.deepEqual(commitInvoked, true);
        t.deepEqual(rollbackInvoked, false);
    });

    t.end();
});
