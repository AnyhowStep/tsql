import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("cbrt", (x) => {
            if (typeof x == "number") {
                return Math.cbrt(x);
            } else {
                throw new Error(`cbrt(${typeof x}) not implmented`);
            }
        });
        for (let x=-3; x<=3; x+=0.3) {
            if (x == -3.3306690738754696e-16) {
                x = 0;
            }
            await tsql.selectValue(() => tsql.double.cbrt(x))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, Math.cbrt(x), x.toString());
                });
        }
    });

    t.end();
});
