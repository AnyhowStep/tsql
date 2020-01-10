import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("cos", (x) => {
            if (typeof x == "number") {
                return Math.cos(x);
            } else {
                throw new Error(`cos(${typeof x}) not implmented`);
            }
        });
        for (let x=-6; x<=6; x+=0.25) {
            await tsql.selectValue(() => tsql.double.cos(x))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, Math.cos(x), x.toString());
                });
        }
    });

    await pool.disconnect();t.end();
});
