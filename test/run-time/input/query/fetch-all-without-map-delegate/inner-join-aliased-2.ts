import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {compareSqlPretty} from "../../../../compare-sql-pretty";

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

        const query = tsql.from(test)
            .innerJoinUsingPrimaryKey(
                tables => tables.test,
                other.as("aliased")
            )
            .select(columns => [
                columns.test,
                columns.aliased,
            ])
            .orderBy(columns => [
                columns.test.testId.desc(),
            ]);

        compareSqlPretty(__filename, t, query);

        return query
            .fetchAll(
                connection
            );
    });
    t.deepEqual(
        resultSet,
        [
            {
                test : {
                    testId: BigInt(3),
                    testVal: BigInt(300),
                },
                aliased : {
                    testId: BigInt(3),
                    otherVal: BigInt(333),
                },
            },
            {
                test : {
                    testId: BigInt(1),
                    testVal: BigInt(100),
                },
                aliased : {
                    testId: BigInt(1),
                    otherVal: BigInt(111),
                },
            },
        ]
    );

    await pool.disconnect();
    t.end();
});
