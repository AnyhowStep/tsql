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
            testVal2 : tm.mysql.bigIntSigned(),
        })
        .setAutoIncrement(columns => columns.testId)
        .addExplicitDefaultValue(columns => [columns.testVal2])
        .disableInsert();

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                testVal INT NOT NULL,
                testVal2 INT NOT NULL
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
                type : tsql.SchemaValidationWarningType.COLUMN_EXPLICIT_DEFAULT_VALUE_ON_APPLICATION_ONLY_INSERT_DISABLED,
                description : `Column "test"."testVal2" has explicit default value on application only; INSERTs will fail but INSERTs are disabled`,
                tableAlias : "test",
                columnAlias : "testVal2",
            }
        );
    });

    await pool.disconnect();
    t.end();
});
