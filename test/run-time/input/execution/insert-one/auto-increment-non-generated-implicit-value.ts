import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

/**
 * @todo How do we want to solve this problem?
 * Forbid expressions? Let it be a run-time error?
 */
tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setAutoIncrement(columns => columns.testId)
        .enableExplicitAutoIncrementValue();

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

        return tsql.ExecutionUtil.insertOne(
            test,
            connection,
            {
                testVal : BigInt(400),
            }
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
            return test.fetchOneByPrimaryKey(connection, { testId : BigInt(4) });
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

    t.end();
});
