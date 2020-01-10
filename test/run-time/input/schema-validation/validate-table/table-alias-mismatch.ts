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
        .setPrimaryKey(columns => [columns.testId]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test2 (
                testId INT PRIMARY KEY,
                testVal INT
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
        t.deepEqual(result.warnings.length, 0);
        t.deepEqual(result.errors.length, 1);
        t.deepEqual(
            result.errors[0],
            {
                type : tsql.SchemaValidationErrorType.TABLE_ALIAS_MISMATCH,
                description : `Application table is named "test", database table is named "test2"`,
                applicationTableAlias : "test",
                databaseTableAlias : "test2",
            }
        );
    });

    await pool.disconnect();t.end();
});
