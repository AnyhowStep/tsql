import * as tape from "tape";
import {Pool} from "./promise.sql";
import {SqliteWorker} from "./worker.sql";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("takes1", (x) => x);

        await connection.exec("SELECT typeof('hello'), takes1('hello'), 'hello'")
            .then((r) => {
                t.deepEqual(r.execResult[0].values, [["text", "hello", "hello"]]);
            })
            .catch(() => {
                t.fail();
            });

    });

    t.end();
});
