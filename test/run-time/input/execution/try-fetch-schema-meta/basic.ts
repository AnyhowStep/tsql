import * as tape from "tape";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
//import * as util from "util";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const result = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE dst (
                a INTEGER PRIMARY  KEY AUTOINCREMENT,
                b INT CONSTRAINT ub UNIQUE,
                "c""c" INT,
                "d" INT CONSTRAINT "u""d" UNIQUE,
                CONSTRAINT "c""d" UNIQUE ("c""c", d),
                CONSTRAINT a_d UNIQUE (a, "d")
            );
        `);

        return connection.tryFetchSchemaMeta(undefined);
    });

    if (result == undefined) {
        t.fail("Expected SchemaMeta");
        await pool.disconnect();t.end();
        return;
    }

    const tables = result.tables.filter(table => table.tableAlias != "sqlite_sequence");
    t.deepEqual(
        tables,
        [
            {
                tableAlias: 'dst',
                columns: [
                    {
                        columnAlias: 'a',
                        isAutoIncrement: true,
                        isNullable: true,
                        explicitDefaultValue: undefined,
                        generationExpression: undefined
                    },
                    {
                        columnAlias: 'b',
                        isAutoIncrement: false,
                        isNullable: true,
                        explicitDefaultValue: undefined,
                        generationExpression: undefined
                    },
                    {
                        columnAlias: 'c"c',
                        isAutoIncrement: false,
                        isNullable: true,
                        explicitDefaultValue: undefined,
                        generationExpression: undefined
                    },
                    {
                        columnAlias: 'd',
                        isAutoIncrement: false,
                        isNullable: true,
                        explicitDefaultValue: undefined,
                        generationExpression: undefined
                    }
                ],
                candidateKeys: [
                    { candidateKeyName: 'ub', columnAliases: [ 'b' ] },
                    { candidateKeyName: 'u"d', columnAliases: [ 'd' ] },
                    { candidateKeyName: 'c"d', columnAliases: [ 'c"c', 'd' ] },
                    { candidateKeyName: 'a_d', columnAliases: [ 'a', 'd' ] }
                ],
                primaryKey: {
                    candidateKeyName: 'a',
                    columnAliases: [ 'a' ]
                }
            }
        ]
    );

    await pool.disconnect();t.end();
});
