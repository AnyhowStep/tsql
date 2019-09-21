import * as tape from "tape";
import {Pool} from "./promise.sql";
import {SqliteWorker} from "./worker.sql";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("takes1", (x) => x);

        await connection.exec("SELECT typeof(X'68656c6c6f'), takes1(X'68656c6c6f'), X'68656c6c6f'")
            .then((r) => {
                t.deepEqual(r.execResult[0].values, [["blob", Buffer.from("hello"), Buffer.from("hello")]]);
            })
            .catch(() => {
                t.fail();
            });

    });

    t.end();
});
