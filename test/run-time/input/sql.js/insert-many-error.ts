import * as tm from "type-mapping";
import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    const createTableResult = db.exec("CREATE TABLE testTable (a INT PRIMARY KEY, b INT)");
    t.deepEqual(createTableResult, []);

    const insertResult = db.exec("INSERT INTO testTable (a, b) VALUES (1337, 9001)");
    t.deepEqual(insertResult, []);

    t.throws(() => {
        db.exec(`
            INSERT INTO testTable (a, b) VALUES (1, 1), (2, 2), (1337, 9001);
        `);
    });

    const fetchResult = db.exec(`
        SELECT a, b FROM testTable ORDER BY a ASC;
    `);
    t.deepEqual(
        fetchResult[0].values,
        [
            [
                tm.BigInt(1337),
                tm.BigInt(9001),
            ],
        ]
    );

    const closeResult = db.close();
    t.deepEqual(closeResult, null);

    t.end();
});
