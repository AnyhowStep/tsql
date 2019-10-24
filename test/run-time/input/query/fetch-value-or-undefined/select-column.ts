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
            });

        return tsql.from(test)
            .select(columns => [
                columns.testVal
            ])
            .orderBy(columns => [
                columns.testId.desc(),
            ])
            .limit(1)
            .fetchValueOrUndefined(
                connection
            );
    });
    t.deepEqual(
        resultSet,
        BigInt(300)
    );

    t.end();
});

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire(async (connection) => {
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
            });

        return tsql.from(test)
            .select(columns => [
                columns.testVal
            ])
            .orderBy(columns => [
                columns.testId.desc(),
            ])
            .limit(1)
            .fetchValue(connection)
            .orUndefined();
    });
    t.deepEqual(
        resultSet,
        BigInt(300)
    );

    t.end();
});
