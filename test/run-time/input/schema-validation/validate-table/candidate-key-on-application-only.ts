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
        .setPrimaryKey(columns => [columns.testId])
        .addCandidateKey(columns => [columns.testVal, columns.testVal2]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT NOT NULL PRIMARY KEY,
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
        t.deepEqual(result.warnings, []);
        t.deepEqual(result.errors.length, 1);
        t.deepEqual(
            result.errors[0],
            {
                type : tsql.SchemaValidationErrorType.CANDIDATE_KEY_ON_APPLICATION_ONLY,
                description : `Table "test" has CANDIDATE KEY ("testVal", "testVal2") on application only`,
                tableAlias : "test",
                applicationCandidateKey : ["testVal", "testVal2"],
            }
        );
    });

    await pool.disconnect();t.end();
});
