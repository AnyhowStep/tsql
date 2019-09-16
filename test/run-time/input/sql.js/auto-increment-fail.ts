import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    /**
     * `INT PRIMARY KEY` is the wrong syntax.
     */
    const createTableResult = db.exec("CREATE TABLE testTable (testTableId INT PRIMARY KEY, val INT)");
    t.deepEqual(createTableResult, []);

    const insertResult = db.exec("INSERT INTO testTable (val) VALUES (888)");
    t.deepEqual(insertResult, []);

    const insertResult2 = db.exec(`
        INSERT INTO testTable (val) VALUES (999), (101010);
    `);
    t.deepEqual(insertResult2, []);

    const selectResults = db.exec("SELECT testTableId, val FROM testTable ORDER BY testTableId ASC");
    t.deepEqual(
        selectResults,
        [
            {
                columns: [ 'testTableId', 'val' ],
                values: [
                    [ null, 888 ],
                    [ null, 999 ],
                    [ null, 101010 ]
                ]
            }
        ]
    );

    t.end();
});
