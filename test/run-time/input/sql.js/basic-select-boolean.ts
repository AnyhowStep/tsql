import * as tm from "type-mapping";
import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    const selectResults = db.exec("SELECT TRUE, FALSE");

    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

    t.deepEqual(selectResults.length, 1);
    const selectResult = selectResults[0];
    t.deepEqual(selectResult.columns, ["TRUE", "FALSE"]);
    t.deepEqual(selectResult.values.length, 1);
    t.deepEqual(selectResult.values[0][0], BigInt(1));
    t.deepEqual(selectResult.values[0][1], BigInt(0));

    t.end();
});
