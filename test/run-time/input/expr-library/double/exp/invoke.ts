import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("exp", (x) => {
            if (typeof x == "number") {
                return Math.exp(x);
            } else {
                throw new Error(`exp(${typeof x}) not implmented`);
            }
        });
        for (let x=-6; x<=6; x+=0.25) {
            await tsql.selectValue(() => tsql.double.exp(x))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, Math.exp(x), x.toString());
                })
                .catch((_err) => {
                    t.fail(x.toString());
                });
        }
    });

    await pool.disconnect();
    t.end();
});
