import * as tm from "type-mapping";
import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    const createTableResult = db.exec("CREATE TABLE testTable (a INT PRIMARY KEY, b INT, CONSTRAINT testTableBUnique UNIQUE(b))");
    t.deepEqual(createTableResult, []);

    const insertResult = db.exec("INSERT INTO testTable (a, b) VALUES (1, 1), (2, 2)");
    t.deepEqual(insertResult, []);

    db.exec(`
        INSERT OR REPLACE INTO testTable (a, b) VALUES (1, 2);
    `);

    t.deepEqual(db.getRowsModified(), 1);

    const fetchResult = db.exec(`
        SELECT a, b FROM testTable ORDER BY a ASC;
    `);
    t.deepEqual(
        fetchResult[0].values,
        [
            [
                tm.BigInt(1),
                tm.BigInt(2),
            ],
        ]
    );

    const closeResult = db.close();
    t.deepEqual(closeResult, null);

    t.end();
});
