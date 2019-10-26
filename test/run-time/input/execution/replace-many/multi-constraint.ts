import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT,
                CONSTRAINT test_testVal UNIQUE(testVal)
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300),
                (4, 444),
                (7, 777);
        `);

        return tsql.ExecutionUtil.replaceMany(
            connection,
            test,
            [
                {
                    testId : BigInt(5),
                    testVal : BigInt(444),
                },
                {
                    testId : BigInt(1),
                    testVal : BigInt(111),
                },
                {
                    testId : BigInt(6),
                    testVal : BigInt(666),
                },
                {
                    testId : BigInt(5),
                    testVal : BigInt(444),
                },
                {
                    testId : BigInt(2),
                    testVal : BigInt(300),
                },
                {
                    testId : BigInt(7),
                    testVal : BigInt(777),
                },
            ]
        );
    });
    t.deepEqual(
        insertResult.insertedOrReplacedRowCount,
        BigInt(6)
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(0)
    );

    await pool
        .acquire(async (connection) => {
            return tsql
                .from(test)
                .select(columns => [columns])
                .orderBy(columns => [
                    columns.testId.asc(),
                ])
                .fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : BigInt(1),
                        testVal : BigInt(111),
                    },
                    {
                        testId : BigInt(2),
                        testVal : BigInt(300),
                    },
                    {
                        testId : BigInt(5),
                        testVal : BigInt(444),
                    },
                    {
                        testId : BigInt(6),
                        testVal : BigInt(666),
                    },
                    {
                        testId : BigInt(7),
                        testVal : BigInt(777),
                    },
                ]
            );
        });

    t.end();
});
