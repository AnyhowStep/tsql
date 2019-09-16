import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();

    const transactionResult = db.exec("BEGIN TRANSACTION");
    t.deepEqual(transactionResult, []);

    t.throws(() => {
        db.exec("BEGIN TRANSACTION");
    });

    t.end();
});
