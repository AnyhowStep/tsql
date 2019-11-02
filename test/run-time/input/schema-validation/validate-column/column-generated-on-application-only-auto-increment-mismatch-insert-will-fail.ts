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
            testVal : tm.mysql.bigIntSigned(),
            testVal2 : tm.mysql.bigIntSigned().orNull(),
        })
        .setAutoIncrement(columns => columns.testId)
        .setPrimaryKey(columns => [columns.testVal]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INTEGER NOT NULL,
                testVal INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                testVal2 INT,
                CONSTRAINT ck UNIQUE (testId)
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
        t.deepEqual(result.errors.length, 2);
        t.deepEqual(
            result.errors[0],
            {
                type : tsql.SchemaValidationErrorType.AUTO_INCREMENT_MISMATCH_INSERT_WILL_FAIL,
                description : `Column "test"."testId" is auto-increment on application, "test"."testVal" on database; INSERTs will fail`,
                tableAlias : "test",
                applicationColumnAlias : "testId",
                databaseColumnAlias : "testVal",
            }
        );
        t.deepEqual(
            result.errors[1],
            {
                type : tsql.SchemaValidationErrorType.COLUMN_GENERATED_ON_APPLICATION_ONLY_AUTO_INCREMENT_MISMATCH_INSERT_WILL_FAIL,
                description : `Column "test"."testId" is auto-increment and generated on application, not on database; INSERTs will fail`,
                tableAlias : "test",
                applicationColumnAlias : "testId",
            }
        );
    });

    t.end();
});
