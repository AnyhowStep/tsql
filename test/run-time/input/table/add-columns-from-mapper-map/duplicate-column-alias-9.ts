import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
        `);

        const test = tsql.table("test")
            .addColumns({
                testId : tsql.DataTypeUtil.makeDataType(
                    (_name : string, mixed : unknown) => String(mixed),
                    (value) => value,
                    () => false
                ),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await test.fetchOne(
            connection,
            columns => tsql.eq(
                columns.testVal,
                BigInt(200)
            )
        ).then((row) => {
            console.log(row);
            t.fail("Should not fetch");
        }).catch((err) => {
            t.true(tm.ErrorUtil.isMappingError(err));
        });

    });

    await pool.disconnect();t.end();
});
