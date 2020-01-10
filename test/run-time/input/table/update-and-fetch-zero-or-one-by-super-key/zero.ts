import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const dst = tsql.table("dst")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned().orNull(),
        })
        .setPrimaryKey(columns => [columns.testId])
        .addMutable(columns => [
            columns.testVal,
        ]);

    const result = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE dst (
                testId INT PRIMARY KEY,
                testVal INT
            );

            INSERT INTO dst(testId, testVal) VALUES
                (1,NULL),
                (2,NULL),
                (3,NULL);
        `);

        return dst.updateAndFetchZeroOrOneBySuperKey(
            connection,
            {
                testId : BigInt(1),
                testVal : BigInt(999),
            },
            () => {
                return {
                    testVal : BigInt(50),
                };
            }
        );
    });
    t.deepEqual(
        result.foundRowCount,
        BigInt(0)
    );
    t.deepEqual(
        result.updatedRowCount,
        BigInt(0)
    );
    t.deepEqual(
        result.warningCount,
        BigInt(0)
    );
    t.deepEqual(
        result.row,
        undefined
    );

    await pool
        .acquire(async (connection) => {
            return tsql.from(dst)
                .select(columns => [columns])
                .orderBy(columns => [
                    columns.testId.asc(),
                ])
                .fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                [
                    {
                        testId : BigInt(1),
                        testVal : null,
                    },
                    {
                        testId : BigInt(2),
                        testVal : null,
                    },
                    {
                        testId : BigInt(3),
                        testVal : null,
                    },
                ]
            );
        });

    await pool.disconnect();
    t.end();
});
