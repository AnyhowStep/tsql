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
                (6, 600),
                (7, 700),
                (3, 300),
                (4, 400),
                (8, 800),
                (9, 900),
                (1, 100),
                (2, 200),
                (5, 500);
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            });

        const cursor = tsql.from(test)
            .orderBy(columns => [
                columns.testId.asc(),
            ])
            .select(c => [c])
            .emulatedCursor(
                connection,
                {
                    rowsPerPage : 3,
                    rowOffset : 2,
                }
            );
        let i = 3;
        for await (const row of cursor) {
            t.deepEqual(
                row,
                { testId : BigInt(i), testVal : BigInt(i*100) },
            );
            ++i;
        }
        t.deepEqual(i, 10);
    });

    await pool.disconnect();
    t.end();
});
