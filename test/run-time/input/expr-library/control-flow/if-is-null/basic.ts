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
            testVal : tm.mysql.bigIntUnsigned().orNull(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
        `);

        await test.insertOne(
            connection,
            {
                testId : BigInt(1),
                testVal : BigInt(100),
            }
        );
        await test.insertOne(
            connection,
            {
                testId : BigInt(2),
                testVal : null,
            }
        );
        await test.insertOne(
            connection,
            {
                testId : BigInt(3),
                testVal : BigInt(300),
            }
        );
        await test.insertOne(
            connection,
            {
                testId : BigInt(4),
                testVal : null,
            }
        );
        await test.insertOne(
            connection,
            {
                testId : BigInt(5),
                testVal : null,
            }
        );
        await test.insertOne(
            connection,
            {
                testId : BigInt(6),
                testVal : BigInt(600),
            }
        );

        await tsql.from(test)
            .select(columns => [
                columns,
                tsql.ifIsNull(
                    columns.testVal,
                    columns.testId,
                    narrowed => tsql.integer.add(
                        narrowed.testVal,
                        BigInt(50)
                    )
                ).as("v")
            ])
            .orderBy(columns => [
                columns.test.testId.asc()
            ])
            .fetchAll(connection)
            .then((rows) => {
                t.deepEqual(
                    rows,
                    [
                        {
                            testId : BigInt(1),
                            testVal : BigInt(100),
                            v : BigInt(150),
                        },
                        {
                            testId : BigInt(2),
                            testVal : null,
                            v : BigInt(2),
                        },
                        {
                            testId : BigInt(3),
                            testVal : BigInt(300),
                            v : BigInt(350),
                        },
                        {
                            testId : BigInt(4),
                            testVal : null,
                            v : BigInt(4),
                        },
                        {
                            testId : BigInt(5),
                            testVal : null,
                            v : BigInt(5),
                        },
                        {
                            testId : BigInt(6),
                            testVal : BigInt(600),
                            v : BigInt(650),
                        },
                    ]
                );
            });
    });

    await pool.disconnect();t.end();
});
