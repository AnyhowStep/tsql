import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        const test2 = tsql.table("test2")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await test.exists(
            connection,
            () => tsql.gt(
                //This column is for a different table
                //This should give us a run-time error
                test2.columns.testVal,
                BigInt(299)
            ) as any
        ).then(() => {
            t.fail("Should not execute");
        }).catch(() => {
            t.pass("Should throw error");
        });

        await test.exists(
            connection,
            columns => tsql.gt(
                columns.testVal,
                BigInt(299)
            )
        ).then((value) => {
            t.deepEqual(value, true);
        });

        await test.exists(
            connection,
            columns => tsql.gt(
                columns.testVal,
                BigInt(300)
            )
        ).then((value) => {
            t.deepEqual(value, false);
        });

        await connection.exec(`DELETE FROM test`);

        await test.exists(
            connection,
            () => tsql.gt(
                //This column is for a different table
                //This should give us a run-time error
                test2.columns.testVal,
                BigInt(299)
            ) as any
        ).then(() => {
            t.fail("Should not execute");
        }).catch(() => {
            t.pass("Should throw error");
        });

        await test.exists(
            connection,
            columns => tsql.gt(
                columns.testVal,
                BigInt(299)
            )
        ).then((value) => {
            t.deepEqual(value, false);
        });

        await test.exists(
            connection,
            columns => tsql.gt(
                columns.testVal,
                BigInt(300)
            )
        ).then((value) => {
            t.deepEqual(value, false);
        });

    });

    t.end();
});
