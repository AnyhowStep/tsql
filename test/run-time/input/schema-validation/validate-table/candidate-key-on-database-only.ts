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
                testId INT NOT NULL,
                testVal INT NOT NULL,
                CONSTRAINT pk PRIMARY KEY (testId),
                CONSTRAINT ck UNIQUE (testId, testVal)
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
                type : tsql.SchemaValidationWarningType.CANDIDATE_KEY_ON_DATABASE_ONLY,
                description : `Table "test" has CANDIDATE KEY ("testId", "testVal") on database only`,
                tableAlias : "test",
                databaseCandidateKey : ["testId", "testVal"],
            }
        );
    });

    await pool.disconnect();t.end();
});
