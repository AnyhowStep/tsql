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
            testVal2 : tm.mysql.bigIntUnsigned(),
        })
        .setAutoIncrement(columns => columns.testId)
        .addExplicitDefaultValue(columns => [
            columns.testVal,
            columns.testVal2,
        ]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INTEGER PRIMARY KEY AUTOINCREMENT,
                testVal INT DEFAULT 1337,
                testVal2 INT DEFAULT 1337,
                CONSTRAINT u UNIQUE(testVal),
                CONSTRAINT u2 UNIQUE(testVal2)
            );
            INSERT INTO
                test(testId, testVal, testVal2)
            VALUES
                (1, 100, 100),
                (2, 200, 1337),
                (3, 1337, 300);
        `);

        return test.replaceOne(
            connection,
            {}
        );
    });
    t.deepEqual(
        insertResult.insertedOrReplacedRowCount,
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

    await pool
        .acquire(async (connection) => {
            await test.existsByPrimaryKey(connection, { testId : BigInt(2) })
                .then((result) => {
                    t.deepEqual(result, false);
                });
            await test.existsByPrimaryKey(connection, { testId : BigInt(3) })
                .then((result) => {
                    t.deepEqual(result, false);
                });
            return test.fetchOneByPrimaryKey(connection, { testId : BigInt(4) });
        })
        .then((row) => {
            t.deepEqual(
                row,
                {
                    testId : BigInt(4),
                    testVal : BigInt(1337),
                    testVal2 : BigInt(1337),
                }
            );
        });

    await pool.disconnect();t.end();
});
