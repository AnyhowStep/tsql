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
        .setPrimaryKey(columns => [columns.testId])
        .addMutable(columns => [
            columns.testVal,
        ]);

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

        await connection.transaction(async (connection) => {
            await connection.savepoint(async (connection) => {
                await dst.where(
                    columns => tsql.gtEq(
                        columns.testVal,
                        BigInt(200)
                    )).updateOne(
                    connection,
                    () => {
                        return {
                            testVal : BigInt(999),
                        };
                    }
                ).then(() => {
                    t.fail("Should not update more than one row");
                }).catch((err) => {
                    t.true(err instanceof tsql.TooManyRowsFoundError);
                });

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

    await pool.disconnect();
    t.end();
});
