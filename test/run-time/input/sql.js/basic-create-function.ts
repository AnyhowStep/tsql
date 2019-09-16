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

    const createFunctionResult = db.create_function("customAdd", (a, b) => {
        return Number(a) + Number(b);
    });
    t.true(createFunctionResult == db);


    const selectResults = db.exec("SELECT customAdd(a, b) FROM testTable");

    t.deepEqual(
        selectResults,
        [
            {
                columns: [ 'customAdd(a, b)' ],
                values: [
                    [ 10338 ],
                    [ 10338 ],
                    [ 66 ]
                ],
            }
        ]
    );

    t.end();
});
