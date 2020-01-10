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
        .setPrimaryKey(columns => [columns.testId])
        .addExplicitDefaultValue(columns => [
            columns.testId,
            columns.testVal,
        ]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY DEFAULT 80085,
                testVal INT DEFAULT 1337
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
        `);

        return tsql.ExecutionUtil.replaceOne(
            test,
            connection,
            {}
        );
    });
    t.deepEqual(
        insertResult.insertedOrReplacedRowCount,
        BigInt(1)
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(0)
    );

    await pool
        .acquire(async (connection) => {
            return test.fetchOneByPrimaryKey(connection, { testId : BigInt(80085) });
        })
        .then((row) => {
            t.deepEqual(
                row,
                {
                    testId : BigInt(80085),
                    testVal : BigInt(1337),
                }
            );
        });

    await pool.disconnect();t.end();
});
