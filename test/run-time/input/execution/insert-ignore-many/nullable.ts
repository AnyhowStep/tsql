import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned().orNull(),
            testVal : tm.mysql.bigIntUnsigned().orNull(),
        })
        .addCandidateKey(columns => [columns.testId]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
        `);

        return tsql.ExecutionUtil.insertIgnoreMany(
            test,
            connection,
            [
                {
                    testId : BigInt(1),
                    //testVal : BigInt(100),
                },
                {
                    //testId : BigInt(2),
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
                    tsql.isNull(columns.testId).desc(),
                    columns.testId.asc(),
                ])
                .fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : null,//BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(1),
                        testVal : null,//BigInt(100),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                ]
            );
        });

    await pool.disconnect();
    t.end();
});
