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
        .setPrimaryKey(columns => [columns.testId]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
        `);

        function insertAndFetch () {
            return test.insertAndFetch(
                connection,
                {
                    testId : tsql.integer.add(
                        tsql.from(test)
                            .selectValue(columns => tsql.integer.max(columns.testId))
                            .limit(1)
                            .coalesce(BigInt(0)),
                        BigInt(1)
                    ),
                    testVal : BigInt(0),
                }
            );
        }

        return Promise.all([
            insertAndFetch(),
            insertAndFetch(),
        ]).catch((err) => {
            t.fail(String(err));
            return tsql.from(test)
                .select(columns => [columns])
                .fetchAll(connection);
        });
    });
    t.deepEqual(
        insertResult,
        [
            {
                testId  : BigInt(1),
                testVal : BigInt(0),
            },
            {
                testId  : BigInt(2),
                testVal : BigInt(0),
            },
        ]
    );

    await pool.disconnect();t.end();
});
