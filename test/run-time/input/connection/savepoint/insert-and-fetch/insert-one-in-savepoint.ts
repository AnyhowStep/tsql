import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);



    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT,
                testVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
        `);

        await connection.transaction(async (connection) => {
            await connection.savepoint(async (connection) => {
                await test.insertAndFetch(
                    connection,
                    {
                        testId : BigInt(4),
                        testVal : BigInt(400),
                    }
                );

                await tsql.from(test)
                    .select(columns => [columns])
                    .orderBy(columns => [
                        columns.testId.asc(),
                    ])
                    .fetchAll(connection)
                    .then((result) => {
                        t.deepEqual(
                            result,
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
                                {
                                    testId : BigInt(4),
                                    testVal : BigInt(400),
                                },
                            ]
                        );
                    });
            });
        });

        await tsql.from(test)
            .select(columns => [columns])
            .orderBy(columns => [
                columns.testId.asc(),
            ])
            .fetchAll(connection)
            .then((result) => {
                t.deepEqual(
                    result,
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
                        {
                            testId : BigInt(4),
                            testVal : BigInt(400),
                        },
                    ]
                );
            });
    });

    t.end();
});
