import * as tm from "type-mapping";
import * as sql from "./sql";
import * as tape from "tape";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const sqlite = await sql.initSqlJs();
    const db = new sqlite.Database();
    const selectResults = db.exec("SELECT 1 AS x, 2 AS y UNION SELECT 3, 4");

    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

    t.deepEqual(selectResults.length, 1);
    const selectResult = selectResults[0];
    t.deepEqual(selectResult.columns, ["x", "y"]);
    t.deepEqual(selectResult.values.length, 2);
    t.deepEqual(selectResult.values[0][0], BigInt(1));
    t.deepEqual(selectResult.values[0][1], BigInt(2));
    t.deepEqual(selectResult.values[1][0], BigInt(3));
    t.deepEqual(selectResult.values[1][1], BigInt(4));

    t.end();
});
