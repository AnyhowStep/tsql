import * as sql from "./sql";
import * as tape from "tape";
import {log} from "../../../util";
function logAllProperties(obj : any) {
    if (obj == null) return; // recursive approach
    log(Object.getOwnPropertyNames(obj));
    logAllProperties(Object.getPrototypeOf(obj));
}
tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    logAllProperties(db);

    t.end();
});
