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
                CONSTRAINT testValUnique UNIQUE(testVal)
            );
            INSERT INTO
                test (testId, testVal)
            VALUES
                (0, 100),
                (2, 222);
        `);

        return test.insertIgnoreMany(
            connection,
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
    t.deepEqual(
        insertResult.insertedRowCount,
        BigInt(1)
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(2)
    );

    await pool
        .acquire(async (connection) => {
            return tsql.from(test)
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
                        testId : BigInt(0),
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(2),
                        testVal : BigInt(222),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                ]
            );
        });

    await pool.disconnect();t.end();
});
