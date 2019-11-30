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
                testVal DOUBLE
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100.123),
                (2, 200.456),
                (3, 300.789),
                (4, 100.123),
                (5, 200.456),
                (6, 300.789);
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.finiteNumber(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await tsql.from(test)
            .selectValue(columns => tsql.double.min(columns.testVal))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 100.123);
            });
        await tsql.from(test)
            .selectValue(columns => tsql.double.minDistinct(columns.testVal))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 100.123);
            });
    });

    t.end();
});
