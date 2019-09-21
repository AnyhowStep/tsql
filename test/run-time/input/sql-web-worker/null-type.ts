import * as tape from "tape";
import {Pool} from "./promise.sql";
import {SqliteWorker} from "./worker.sql";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("takes1", (x) => x);

        await connection.exec("SELECT typeof(null), takes1(null), null")
            .then((r) => {
                t.deepEqual(r.execResult[0].values, [["null", null, null]]);
            })
            .catch(() => {
                t.fail();
            });

    });

    t.end();
});
