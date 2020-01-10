import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tsql.dtBigIntSigned(),
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

        return test.insertAndFetch(
            connection,
            {
                testId : tsql.integer.randomSignedBigInt(),
                testVal : BigInt(400),
            }
        );
    });
    t.true(
        tm.TypeUtil.isBigInt(insertResult.testId)
    );
    t.deepEqual(
        insertResult.testVal,
        BigInt(400)
    );

    await pool
        .acquire(async (connection) => {
            return test.fetchOneByPrimaryKey(
                connection,
                insertResult
            );
        })
        .then((row) => {
            t.deepEqual(
                row,
                {
                    testId : insertResult.testId,
                    testVal : BigInt(400),
                }
            );
        });

    await pool
        .acquire(async (connection) => {
            return tsql.from(test).count(connection);
        })
        .then((count) => {
            t.deepEqual(
                count,
                BigInt(4)
            );
        })
        .catch((err) => {
            console.error(err);
            t.fail("Should not fail");
        });

    await pool.disconnect();t.end();
});
