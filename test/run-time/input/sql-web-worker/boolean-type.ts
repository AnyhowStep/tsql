import * as tm from "type-mapping";
import * as tape from "tape";
import {Pool} from "./promise.sql";
import {SqliteWorker} from "./worker.sql";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("takes1", (x) => x);

        const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

        await connection.exec("SELECT typeof(true), typeof(false), takes1(true), takes1(false), true, false")
            .then((r) => {
                t.deepEqual(r.execResult[0].values, [["integer", "integer", BigInt(1), BigInt(0), BigInt(1), BigInt(0)]]);
            })
            .catch((err) => {
                console.error(err, err.sql);
                t.fail(err.message);
            });

        await connection.createFunction("returnTrue", () => true);
        await connection.createFunction("returnFalse", () => false);

        await connection.exec("SELECT returnTrue(), returnFalse()")
            .then((r) => {
                t.deepEqual(r.execResult[0].values, [[BigInt(1), BigInt(0)]]);
            })
            .catch(() => {
                t.fail();
            });

    });

    await pool.disconnect();
    t.end();
});
