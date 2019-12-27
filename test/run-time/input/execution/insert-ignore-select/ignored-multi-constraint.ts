import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const src = tsql.table("src")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    const dst = tsql.table("dst")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE src (
                testId INT,
                testVal INT
            );
            CREATE TABLE dst (
                testId INT PRIMARY KEY,
                testVal INT,
                CONSTRAINT dstUnique UNIQUE (testVal)
            );

            INSERT INTO src(testId, testVal) VALUES
                (1,100),
                (2,200),
                (3,300),
                (1,100),
                (2,222),
                (4,300),
                (6,600);
        `);

        return tsql.ExecutionUtil.insertIgnoreSelect(
            connection,
            tsql.from(src)
                .select(columns => [columns]),
            dst,
            (columns) => {
                return {
                    testId : columns.testId,
                    testVal : columns.testVal,
                    //Should ignore extra properties during run-time.
                    //Does not give compile-error because of,
                    //https://github.com/microsoft/TypeScript/issues/241
                    blah : 2,
                };
            }
        );
    });
    t.deepEqual(
        insertResult.insertedRowCount,
        BigInt(4)
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(3)
    );

    await pool
        .acquire(async (connection) => {
            return tsql.from(dst)
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
                        testId : BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                    {
                        testId : BigInt(6),
                        testVal : BigInt(600),
                    },
                ]
            );
        });

    t.end();
});
