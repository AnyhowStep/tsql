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

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE dst (
                testId INT PRIMARY KEY,
                testVal INT
            );

            INSERT INTO dst(testId, testVal) VALUES
                (2,NULL),
                (3,NULL);
        `);

        return dst.updateAndFetchOneByCandidateKey(
            connection,
            {
                testId : BigInt(1),
            },
            columns => {
                return {
                    testVal : tsql.integer.add(
                        tsql.coalesce(columns.testVal, BigInt(100)),
                        BigInt(50)
                    ),
                };
            }
        ).then(() => {
            t.fail("Should not be able to update row that does not exist");
        }).catch((err) => {
            t.true(err instanceof tsql.RowNotFoundError);
        });
    });

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

    t.end();
});