import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("radians", (x) => {
            if (typeof x == "number") {
                return x * Math.PI/180;
            } else {
                throw new Error(`radians(${typeof x}) not implmented`);
            }
        });
        for (let x=-6; x<=6; x+=0.25) {
            await tsql.selectValue(() => tsql.double.radians(x))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, x * Math.PI/180, x.toString());
                })
                .catch((err) => {
                    t.fail(`${x} ${err.message}`);
                });
        }
    });

    await pool.disconnect();
    t.end();
});
