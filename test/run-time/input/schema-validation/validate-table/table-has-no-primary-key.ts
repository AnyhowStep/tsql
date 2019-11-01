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
        .addCandidateKey(columns => [columns.testId]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT NOT NULL,
                testVal INT NOT NULL,
                CONSTRAINT ck0 UNIQUE (testId)
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
        t.deepEqual(result.errors.length, 0);
        t.deepEqual(
            result.warnings[0],
            {
                type : tsql.SchemaValidationWarningType.TABLE_HAS_NO_PRIMARY_KEY,
                description : `Table "test" has no PRIMARY KEY`,
                tableAlias : "test",
            }
        );
    });

    t.end();
});
