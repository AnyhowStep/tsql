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
        .setAutoIncrement(columns => columns.testId)
        .removeGenerated(columns => [columns.testId]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                testVal INT NOT NULL
            );
        `);

        return tsql.ExecutionUtil.insertMany(
            connection,
            test,
            [
                {
                    testVal : BigInt(100),
                },
                {
                    testId : tsql.integer.add(
                        BigInt(42),
                        BigInt(69)
                    ),
                    testVal : BigInt(200),
                },
                {
                    testVal : BigInt(300),
                },
            ]
        );
    });
    t.deepEqual(
        insertResult.insertedRowCount,
        BigInt(3)
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(0)
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
                        testId : BigInt(1),
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(111),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(112),
                        testVal : BigInt(300),
                    },
                ]
            );
        });

    t.end();
});
