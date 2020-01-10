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
                (7, 400);
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.bigInt(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await tsql.from(test)
            .selectValue(columns => tsql.integer.avg(columns.testVal))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, ((100+200+300+100+200+300+400)/7).toString());
            });
        await tsql.from(test)
            .selectValue(columns => tsql.integer.avgDistinct(columns.testVal))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, ((100+200+300+400)/4).toString() + ".0");
            });
    });

    await pool.disconnect();t.end();
});
