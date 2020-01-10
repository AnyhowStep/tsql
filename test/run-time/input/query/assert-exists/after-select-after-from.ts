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
            });

        await tsql.from(test)
            .select(columns => [columns])
            .assertExists(
                connection
            )
            .then(() => {
                t.pass();
            })
            .catch(() => {
                t.fail("Should exist");
            });

        await connection.exec(`DELETE FROM test`);

        await tsql.from(test)
            .select(columns => [columns])
            .assertExists(
                connection
            )
            .then(() => {
                t.fail("Should not exist");
            })
            .catch(() => {
                t.pass();
            });

    });

    await pool.disconnect();
    t.end();
});
