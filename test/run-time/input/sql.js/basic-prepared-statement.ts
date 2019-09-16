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

    const stmt = db.prepare("SELECT a, b FROM testTable WHERE a > $v");

    stmt.bind({
        $v : 1000
    });

    let invokeCount = 0;
    while (stmt.step()) {
        const obj = stmt.getAsObject();
        t.deepEqual(obj, { a : 1337, b : 9001 });
        ++invokeCount;
    }
    t.deepEqual(invokeCount, 2);

    stmt.reset();


    stmt.bind({
        $v : 20
    });

    invokeCount = 0;
    while (stmt.step()) {
        const obj = stmt.getAsObject();
        if (obj.a == 1337) {
            t.deepEqual(obj, { a : 1337, b : 9001 });
        } else {
            t.deepEqual(obj, { a : 42, b : 24 });
        }
        ++invokeCount;
    }
    t.deepEqual(invokeCount, 3);


    stmt.free();

    t.end();
});
