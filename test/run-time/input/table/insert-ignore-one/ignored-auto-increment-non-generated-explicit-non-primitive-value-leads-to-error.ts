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

    await pool.acquire(async (connection) => {
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
                (3, 300),
                (5, 444);
        `);

        return test.insertIgnoreOne(
            connection,
            {
                testId : tsql.ExprUtil.fromBuiltInExpr(BigInt(5)),
                testVal : BigInt(400),
            } as any
        ).then(() => {
            t.fail("Should not insert anything");
        }).catch(() => {
            t.pass("Should error");
        });
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

    t.end();
});
