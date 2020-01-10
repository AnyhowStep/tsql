import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("sqrt", (x) => {
            if (typeof x == "number") {
                return Math.sqrt(x);
            } else {
                throw new Error(`sqrt(${typeof x}) not implmented`);
            }
        });
        for (let x=-6; x<=6; x+=0.25) {
            if (x < 0) {
                /**
                 * cannot take square root of a negative number
                 */
                await tsql.selectValue(() => tsql.double.sqrt(x))
                    .fetchValue(connection)
                    .then((value) => {
                        t.fail(`sqrt(${x}) === ${value}`);
                    })
                    .catch(() => {
                        t.pass();
                    });
            } else {
                await tsql.selectValue(() => tsql.double.sqrt(x))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, Math.sqrt(x), x.toString());
                    });
            }
        }
    });

    await pool.disconnect();
    t.end();
});
