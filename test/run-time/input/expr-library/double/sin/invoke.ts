import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("sin", (x) => {
            if (typeof x == "number") {
                return Math.sin(x);
            } else {
                throw new Error(`sin(${typeof x}) not implmented`);
            }
        });
        for (let x=-6; x<=6; x+=0.25) {
            await tsql.selectValue(() => tsql.double.sin(x))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, Math.sin(x), x.toString());
                });
        }
    });

    t.end();
});
