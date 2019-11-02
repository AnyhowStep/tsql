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
            CREATE TABLE test (
                testId INT NOT NULL PRIMARY KEY,
                testVal INT NOT NULL
            );
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
        const result = tsql.SchemaValidationUtil.validateSchema(
            [test],
            schemaMeta
        );
        t.deepEqual(result.warnings.length, 1);
        t.deepEqual(result.errors.length, 0);
        t.deepEqual(
            result.warnings[0],
            {
                type : tsql.SchemaValidationWarningType.TABLE_ON_DATABASE_ONLY,
                description : `Table "main"."test2" exists on database only`,
                databaseTableAlias : "test2",
            }
        );
    });

    t.end();
});
