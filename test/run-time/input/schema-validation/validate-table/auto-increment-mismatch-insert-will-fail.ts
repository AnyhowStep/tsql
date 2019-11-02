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
            testVal2 : tm.mysql.bigIntUnsigned(),
        })
        .setAutoIncrement(columns => columns.testVal)
        .setPrimaryKey(columns => [columns.testId])
        .removeGenerated(columns => [columns.testVal]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                testVal INT NOT NULL,
                testVal2 INT NOT NULL,
                CONSTRAINT ck UNIQUE (testVal)
            );
        `);

        const schemaMeta = await connection.tryFetchSchemaMeta(undefined);
        if (schemaMeta == undefined) {
            t.fail("Expected schemaMeta");
            return;
        }
        const result = tsql.SchemaValidationUtil.validateTable(
            test,
            schemaMeta.tables[0]
        );
        t.deepEqual(result.warnings, []);
        t.deepEqual(result.errors.length, 1);
        t.deepEqual(
            result.errors[0],
            {
                type : tsql.SchemaValidationErrorType.AUTO_INCREMENT_MISMATCH_INSERT_WILL_FAIL,
                description : `Column "test"."testVal" is auto-increment on application, "test"."testId" on database; INSERTs will fail`,
                tableAlias : "test",
                applicationColumnAlias : "testVal",
                databaseColumnAlias : "testId",
            }
        );
    });

    t.end();
});
