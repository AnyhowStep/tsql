import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId])
        .disableInsert();

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (4, 444);
        `);

        return (test as (typeof test & tsql.InsertableTable)).insertIgnoreOne(
            connection,
            {
                testId : BigInt(4),
                testVal : BigInt(400),
            }
        ).then(() => {
            t.fail("Should not be able to insert");
        }).catch(() => {
            t.pass("Should fail to insert");
        });
    });

    await pool
        .acquire(async (connection) => {
            return tsql.from(test).select(columns => [columns]).fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : BigInt(4),
                        testVal : BigInt(444),
                    }
                ]
            );
        });

    await pool.disconnect();t.end();
});
