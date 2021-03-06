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
        .setAutoIncrement(columns => columns.testId);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INTEGER PRIMARY KEY AUTOINCREMENT,
                testVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
        `);

        return tsql.ExecutionUtil.insertIgnoreOne(
            test,
            connection,
            {
                testId : BigInt(5),
                testVal : BigInt(400),
            } as any
        );
    });
    t.deepEqual(
        insertResult.insertedRowCount,
        BigInt(1)
    );
    t.deepEqual(
        insertResult.autoIncrementId,
        BigInt(4)
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(0)
    );
    t.deepEqual(
        insertResult.testId,
        BigInt(4)
    );

    await pool
        .acquire(async (connection) => {
            return test.whereEqPrimaryKey({ testId : BigInt(4) }).fetchOne(connection);
        })
        .then((row) => {
            t.deepEqual(
                row,
                {
                    testId : BigInt(4),
                    testVal : BigInt(400),
                }
            );
        })
        .catch((err) => {
            console.error(err);
            t.fail("Should not fail");
        });

    await pool.disconnect();
    t.end();
});
