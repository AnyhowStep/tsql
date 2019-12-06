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
                testId : tsql.dtBigIntSigned(),
                testVal : tsql.dtBigIntSigned(),
            })
            .addColumns({
                testId : tsql.dtBigIntSigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await test.fetchOneByPrimaryKey(
            connection,
            {
                testId : BigInt(1)
            }
        ).then((row) => {
            t.deepEqual(
                row,
                {
                    testId : BigInt(1),
                    testVal : BigInt(100),
                }
            );
        });

    });

    t.end();
});
