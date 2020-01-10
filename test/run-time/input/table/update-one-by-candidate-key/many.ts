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
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId])
        .addMutable(columns => [
            columns.testVal,
        ]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE dst (
                testId INT,
                testVal INT
            );

            INSERT INTO dst(testId, testVal) VALUES
                (1,100),
                (1,100),
                (2,200),
                (3,300);
        `);

        return dst.updateOneByCandidateKey(
            connection,
            {
                testId : BigInt(1),
            },
            columns => {
                return {
                    testVal : tsql.integer.add(
                        columns.testVal,
                        BigInt(50)
                    ),
                };
            }
        ).then(() => {
            t.fail("Should not update anything");
        }).catch((err) => {
            t.true(err instanceof tsql.TooManyRowsFoundError);
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
                        testId : BigInt(1),
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(1),
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                ]
            );
        });

    await pool.disconnect();
    t.end();
});
