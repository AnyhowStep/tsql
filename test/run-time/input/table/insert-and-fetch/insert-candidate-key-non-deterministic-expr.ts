import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tsql.dtBigIntSigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .addCandidateKey(columns => [columns.testId])
        .addExplicitDefaultValue(columns => [
            columns.testId,
            columns.testVal,
        ]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY NOT NULL DEFAULT 11,
                testVal INT NOT NULL DEFAULT 11
            );
        `);

        return (test).insertAndFetch(
            connection,
            {
                testId : tsql.integer.randomSignedBigInt(),
                testVal : BigInt(400),
            }
        );
    });
    t.true(
        tm.TypeUtil.isBigInt(insertResult.testId)
    );
    t.deepEqual(
        insertResult.testVal,
        BigInt(400)
    );

    await pool
        .acquire(async (connection) => {
            return tsql.from(test).select(columns => [columns]).fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : insertResult.testId,
                        testVal : BigInt(400),
                    }
                ]
            );
        });

    await pool.disconnect();t.end();
});
