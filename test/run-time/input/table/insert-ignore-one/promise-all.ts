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
        .setAutoIncrement(columns => columns.testId);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INTEGER PRIMARY KEY AUTOINCREMENT,
                testVal INT
            );
        `);

        function insertIgnoreOne () {
            return test.insertIgnoreOne(
                connection,
                {
                    testVal : BigInt(0),
                }
            );
        }

        return Promise.all([
            insertIgnoreOne(),
            insertIgnoreOne(),
        ]).then((result) => {
            return result.map(r => r.autoIncrementId);
        }).catch((err) => {
            t.fail(String(err));
            return tsql.from(test)
                .select(columns => [columns.testId])
                .fetchValueArray(connection);
        });
    });
    t.deepEqual(
        insertResult,
        [
            BigInt(1),
            BigInt(2),
        ]
    );

    t.end();
});
