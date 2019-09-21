import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("tan", (x) => {
            if (typeof x == "number") {
                return Math.tan(x);
            } else {
                throw new Error(`tan(${typeof x}) not implmented`);
            }
        });
        for (let x=-6; x<=6; x+=0.25) {
            await tsql.selectValue(() => tsql.double.tan(x))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, Math.tan(x), x.toString());
                });
        }
    });

    t.end();
});
