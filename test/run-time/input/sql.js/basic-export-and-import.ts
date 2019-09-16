import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    const createTableResult = db.exec("CREATE TABLE testTable (a INT, b INT)");
    t.deepEqual(createTableResult, []);

    const insertResult = db.exec("INSERT INTO testTable (a, b) VALUES (1337, 9001)");
    t.deepEqual(insertResult, []);

    const insertResult2 = db.exec(`
        INSERT INTO testTable (a, b) VALUES (1337, 9001);
        INSERT INTO testTable (a, b) VALUES (42, 24);
    `);
    t.deepEqual(insertResult2, []);

    const exportUint8Array = db.export();
    const db2 = new sqlite.Database(exportUint8Array);

    /**
     * Insert more stuff into the old database to see if `db2` is really
     * using a separate copy.
     */
    db.exec(`
        INSERT INTO testTable (a, b) VALUES (1337, 9001);
        INSERT INTO testTable (a, b) VALUES (42, 24);
    `);

    const selectResults = db2.exec("SELECT a, b FROM testTable ORDER BY a ASC");
    t.deepEqual(
        selectResults,
        [
            {
                columns: [ 'a', 'b' ],
                values: [
                    [ 42, 24 ],
                    [ 1337, 9001 ],
                    [ 1337, 9001 ]
                ]
            }
        ]
    );

    t.end();
});
