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

        await test.fetchValue(
            connection,
            columns => tsql.gt(
                columns.testVal,
                BigInt(255)
            ),
            columns => tsql.integer.add(columns.testVal, BigInt(45))
        ).then((row) => {
            t.deepEqual(
                row,
                BigInt(345)
            );
        }).catch((err) => {
            console.error(err);
            t.fail("Should not throw");
        });

        await test.fetchValue(
            connection,
            columns => tsql.gt(
                columns.testVal,
                BigInt(300)
            ),
            columns => tsql.integer.add(columns.testVal, BigInt(45))
        ).then(() => {
            t.fail("Should not fetch anything");
        }).catch((err) => {
            t.true(err instanceof tsql.RowNotFoundError);
        });

        await test.fetchValue(
            connection,
            columns => tsql.gt(
                columns.testVal,
                BigInt(100)
            ),
            columns => tsql.integer.add(columns.testVal, BigInt(45))
        ).then(() => {
            t.fail("Should not fetch anything");
        }).catch((err) => {
            t.true(err instanceof tsql.TooManyRowsFoundError);
        });
    });

    await pool.disconnect();t.end();
});
