import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
            CREATE TABLE other (
                testId INT PRIMARY KEY,
                otherVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
            INSERT INTO
                other(testId, otherVal)
            VALUES
                (1, 111),
                (3, 333);
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            });

        const other = tsql.table("other")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                otherVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        return tsql.from(test)
            .innerJoinUsingPrimaryKey(
                tables => tables.test,
                other
            )
            .select(columns => [columns])
            .orderBy(columns => [
                columns.test.testId.desc(),
            ])
            .limit(1)
            .map((row) => {
                return {
                    test : row.test,
                    other2 : row.other,
                    total : row.test.testVal + row.other.otherVal,
                };
            })
            .map((row) => {
                return {
                    ...row,
                    hello : "hi",
                };
            })
            .map((row) => {
                return {
                    root : row,
                };
            })
            .fetchOneOr(
                /**
                 * @todo Make `connection` implement `IConnection` properly
                 */
                connection as unknown as tsql.IConnection,
                "Hello, world"
            );
    });
    t.deepEqual(
        resultSet,
        {
            root : {
                test: { testId: 3n, testVal: 300n },
                other2: { testId: 3n, otherVal: 333n },
                total: 633n,
                hello: "hi",
            }
        }
    );

    t.end();
});
