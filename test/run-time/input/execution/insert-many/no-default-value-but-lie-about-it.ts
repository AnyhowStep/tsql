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
        .addCandidateKey(columns => [columns.testId])
        .addExplicitDefaultValue(columns => [
            //testVal is NOT NULL and has no DEFAULT value
            //but we are lying about it
            columns.testVal,
        ]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT NOT NULL PRIMARY KEY,
                testVal INT NOT NULL
            );
        `);

        return tsql.ExecutionUtil.insertMany(
            test,
            connection,
            [
                {
                    testId : BigInt(999),
                    testVal : BigInt(999),
                },
                {
                    testId : BigInt(1),
                    //testVal : BigInt(100),
                },
                {
                    testId : BigInt(888),
                    testVal : BigInt(888),
                },
            ]
        );
    }).then(() => {
        t.fail("Should not insert anything");
    }).catch((err) => {
        t.pass(err.message);
    });

    await pool
        .acquire(async (connection) => {
            return tsql.from(test)
                .select(columns => [columns])
                .orderBy(columns => [
                    columns.testId.asc(),
                ])
                .fetchAll(connection);
        })
        .then((rows) => {
            t.deepEqual(
                rows,
                []
            );
        });

    await pool.disconnect();t.end();
});
