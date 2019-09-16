import * as tape from "tape";
import {Pool} from "./promise.sql";
import {SqliteWorker} from "./worker.sql";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    const acquireResult = await pool.acquire((connection) => {
        return connection.exec("SELECT 1 AS x, 2 AS y UNION SELECT 3, 4");
    });

    t.deepEqual(acquireResult.rowsModified, 0);
    const selectResults = acquireResult.execResult;

    t.deepEqual(selectResults.length, 1);
    const selectResult = selectResults[0];
    t.deepEqual(selectResult.columns, ["x", "y"]);
    t.deepEqual(selectResult.values.length, 2);
    t.deepEqual(selectResult.values[0][0], 1);
    t.deepEqual(selectResult.values[0][1], 2);
    t.deepEqual(selectResult.values[1][0], 3);
    t.deepEqual(selectResult.values[1][1], 4);

    t.end();
});
