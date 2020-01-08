import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const dst = tsql.table("dst")
        .addColumns({
            testId : tsql.dtBigIntSigned(),
            testVal : tsql.dtBigIntSigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    await pool.acquire(async (connection) => {
        await connection.rawQuery(`
            CREATE TABLE dst (
                testId INT PRIMARY KEY,
                testVal INT
            );

            INSERT INTO dst(testId, testVal) VALUES
                (1,100),
                (2,200),
                (3,300);
        `);

        await dst.deleteOne(
            connection,
            columns => tsql.eq(
                columns.testVal,
                BigInt(200)
            )
        );

        await tsql.from(dst)
            .select(columns => [columns])
            .orderBy(columns => [
                columns.testId.asc(),
            ])
            .fetchAll(connection)
            .then((rows) => {
                t.deepEqual(
                    rows,
                    [
                        {
                            testId : BigInt(1),
                            testVal : BigInt(100),
                        },
                        {
                            testId : BigInt(3),
                            testVal : BigInt(300),
                        },
                    ]
                );
            });
    });

    t.end();
});
