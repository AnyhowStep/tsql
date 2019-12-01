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
        .setPrimaryKey(columns => [columns.testId, columns.testVal])
        .addGenerated(columns => [columns.testId])
        .addExplicitDefaultValue(columns => [
            columns.testVal,
        ]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY NOT NULL DEFAULT 11,
                testVal INT NOT NULL DEFAULT 11
            );
        `);

        await test.insertAndFetch(
            connection,
            {
                testId : BigInt(1),
            } as never
        ).then(() => {
            t.fail("Should not be able to insert anything");
        }).catch((err) => {
            t.true(tm.ErrorUtil.isMappingError(err));
        });

        await test.insertAndFetch(
            connection,
            {
                testId : BigInt(1),
                testVal : BigInt(1),
            } as never
        ).then(() => {
            t.fail("Should not be able to insert anything");
        }).catch((err) => {
            t.true(tm.ErrorUtil.isMappingError(err));
        });

        await test.insertAndFetch(
            connection,
            {
                testVal : BigInt(1),
            } as never
        ).then(() => {
            t.fail("Should not be able to insert anything");
        }).catch((err) => {
            t.true(tm.ErrorUtil.isMappingError(err));
        });

        await test.insertAndFetch(
            connection,
            {
            } as never
        ).then(() => {
            t.fail("Should not be able to insert anything");
        }).catch((err) => {
            t.true(tm.ErrorUtil.isMappingError(err));
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
                ]
            );
        });

    t.end();
});
