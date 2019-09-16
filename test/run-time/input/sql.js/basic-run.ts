import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    const runResult = db.run("SELECT 1 AS x, 2 AS y UNION SELECT 3, 4");

    t.true(runResult == db);

    t.end();
});
