import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const src = tsql.table("src")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE src (
                testId INT PRIMARY KEY,
                testVal INT
            );

            INSERT INTO src(testId, testVal) VALUES
                (1,100),
                (2,200),
                (3,300);
        `);

        const leaky = await connection.transaction(async (leaky) => {
            return leaky;
        });

        await src.fetchOneByPrimaryKey(
            leaky,
            {
                testId : BigInt(1),
            }
        ).then(() => {
            t.fail("Should not be able to use leaked locked connection");
        }).catch((err) => {
            t.true(err instanceof tsql.AsyncQueueStoppingError);
        });

        await leaky
            .lock(async () => {
                t.fail("Should not have lock");
            })
            .then(() => {
                t.fail("Should not be able to use leaked locked connection");
            }).catch((err) => {
                t.true(err instanceof tsql.AsyncQueueStoppingError);
            });
    });

    await pool.disconnect();t.end();
});
