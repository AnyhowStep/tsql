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
        .addExplicitDefaultValue(columns => [columns.testVal2]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                testVal INT NOT NULL DEFAULT 55,
                testVal2 INT DEFAULT 77
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
        t.deepEqual(result.warnings.length, 1);
        t.deepEqual(result.errors, []);
        t.deepEqual(
            result.warnings[0],
            {
                type : tsql.SchemaValidationWarningType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_DATABASE_ONLY,
                description : `Column "test"."testVal" has explicit default value on database only`,
                tableAlias : "test",
                columnAlias : "testVal",
                explicitDefaultValue : "55",
            }
        );
    });

    await pool.disconnect();t.end();
});
