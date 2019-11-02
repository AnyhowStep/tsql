//import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
        });

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
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
        t.deepEqual(result.warnings.length, 3);
        t.deepEqual(result.errors, []);
        t.deepEqual(
            result.warnings[0],
            {
                type : tsql.SchemaValidationWarningType.PRIMARY_KEY_ON_DATABASE_ONLY,
                description : `Table "test" has PRIMARY KEY ("testId") on database only`,
                tableAlias : "test",
                primaryKey : ["testId"],
            }
        );
        t.deepEqual(
            result.warnings[1],
            {
                type : tsql.SchemaValidationWarningType.AUTO_INCREMENT_ON_DATABASE_ONLY,
                description : `Column "test"."testId" is auto-increment on database only`,
                tableAlias : "test",
                columnAlias : "testId",
            }
        );
        t.deepEqual(
            result.warnings[2],
            {
                type : tsql.SchemaValidationWarningType.COLUMN_ON_DATABASE_ONLY_WITH_DEFAULT_OR_GENERATED_VALUE,
                description : `Column "test"."testId" exists on database only; but has a default or generated value`,
                tableAlias : "test",
                databaseColumnAlias : "testId",
                isNullable : false,
                isAutoIncrement : true,
                generationExpression : undefined,
                explicitDefaultValue : undefined,
                insertEnabled : true,
            }
        );
    });

    t.end();
});
