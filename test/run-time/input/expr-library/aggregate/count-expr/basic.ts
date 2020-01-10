import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

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
                (3, 300),
                (4, 100),
                (5, 200),
                (6, 300),
                (7, -2147483648),
                (8, 2147483647),
                (9, 9222372036854775807),
                (10, -9123372036854775808),
                (11, NULL),
                (12, NULL),
                (13, 13),
                (14, NULL);
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.orNull(tm.bigInt()),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await tsql.from(test)
            .selectValue(columns => tsql.countExpr(columns.testVal))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, BigInt("11"));
            });
        await tsql.from(test)
            .selectValue(columns => tsql.countExprDistinct(columns.testVal))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, BigInt("8"));
            });
    });

    await pool.disconnect();t.end();
});
