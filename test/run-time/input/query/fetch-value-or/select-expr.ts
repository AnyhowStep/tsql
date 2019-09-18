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
                testVal : tm.mysql.double(),
            });

        const other = tsql.table("other")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                otherVal : tm.mysql.double(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        return tsql.from(test)
            .innerJoinUsingPrimaryKey(
                tables => tables.test,
                other
            )
            .selectValue(columns => tsql.add(
                columns.test.testVal,
                columns.other.otherVal
            ))
            .orderBy(columns => [
                columns.test.testId.desc(),
            ])
            .limit(1)
            .fetchValueOr(
                connection,
                "Hello, world"
            );
    });
    t.deepEqual(
        resultSet,
        633
    );

    t.end();
});
