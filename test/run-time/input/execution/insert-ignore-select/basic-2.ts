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

    const dst = tsql.table("dst")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE src (
                testId INT PRIMARY KEY,
                testVal INT
            );
            CREATE TABLE dst (
                testId INT PRIMARY KEY,
                testVal INT
            );

            INSERT INTO src(testId, testVal) VALUES
                (1,100),
                (2,200),
                (3,300);
        `);

        return tsql.from(src)
            .select(columns => [columns])
            .insertIgnore(
                connection,
                dst,
                columns => columns
            );
    });
    t.deepEqual(
        insertResult.insertedRowCount,
        BigInt(3)
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(0)
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

    await pool.disconnect();t.end();
});
