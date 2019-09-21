import * as tm from "type-mapping";
import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    /**
     * `AUTOINCREMENT` uses a different algorithm from `INTEGER PRIMARY KEY`
     *
     * https://www.sqlite.org/autoinc.html
     */
    const createTableResult = db.exec("CREATE TABLE testTable (testTableId INTEGER PRIMARY KEY AUTOINCREMENT, val INT)");
    t.deepEqual(createTableResult, []);

    const insertResult = db.exec("INSERT INTO testTable (val) VALUES (888)");
    t.deepEqual(insertResult, []);

    const insertResult2 = db.exec(`
        INSERT INTO testTable (val) VALUES (999), (101010);
    `);
    t.deepEqual(insertResult2, []);

    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

    const selectResults = db.exec("SELECT testTableId, val FROM testTable ORDER BY testTableId ASC");
    t.deepEqual(
        selectResults,
        [
            {
                columns: [ 'testTableId', 'val' ],
                values: [
                    [ BigInt(1), BigInt(888) ],
                    [ BigInt(2), BigInt(999) ],
                    [ BigInt(3), BigInt(101010) ]
                ]
            }
        ]
    );

    t.end();
});
