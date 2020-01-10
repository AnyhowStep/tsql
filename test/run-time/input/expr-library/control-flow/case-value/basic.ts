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
                (10, -9123372036854775808)
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.bigInt(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await tsql.from(test)
            .selectValue(columns => tsql
                .case(columns.testVal)
                .when(BigInt(100), "100")
                .when(BigInt("2147483647"), "2147483647")
                .else("shrug")
                .end()
            )
            .orderBy(columns => [
                columns.test.testId.asc()
            ])
            .fetchValueArray(connection)
            .then((arr) => {
                t.deepEqual(arr, [
                    "100",
                    "shrug",
                    "shrug",
                    "100",
                    "shrug",
                    "shrug",
                    "shrug",
                    "2147483647",
                    "shrug",
                    "shrug",
                ]);
            });
        await tsql.from(test)
            .selectValue(columns => tsql
                .case(columns.testVal)
                .when(BigInt(100), "100")
                .when(BigInt("2147483647"), "2147483647")
                .end()
            )
            .orderBy(columns => [
                columns.test.testId.asc()
            ])
            .fetchValueArray(connection)
            .then((arr) => {
                t.deepEqual(arr, [
                    "100",
                    null,
                    null,
                    "100",
                    null,
                    null,
                    null,
                    "2147483647",
                    null,
                    null,
                ]);
            });
    });

    await pool.disconnect();t.end();
});
