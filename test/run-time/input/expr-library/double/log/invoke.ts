import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("log", (base, x) => {
            if (typeof base == "number" && typeof x == "number") {
                const dividend = Math.log(x);
                if (dividend == -Infinity) {
                    return null;
                }
                const divisor = Math.log(base);
                if (divisor == 0) {
                    return null;
                }
                if (isFinite(divisor)) {
                    return dividend / divisor;
                } else {
                    return null;
                }
            } else {
                throw new Error(`log(${typeof base}/${typeof x}) not implmented`);
            }
        });
        for (let base=-1; base<=6; base+=0.25) {
            for (let x=-1; x<=6; x+=0.25) {
                if (base <= 0 || base == 1 || x <= 0) {
                    await tsql.selectValue(() => tsql.double.log(base, x))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, null);
                        })
                        .catch((err) => {
                            t.fail(`${base}, ${x}: ${err.message}`);
                        });
                } else {
                    await tsql.selectValue(() => tsql.double.log(base, x))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, Math.log(x) / Math.log(base));
                        })
                        .catch((err) => {
                            t.fail(`log(${base}, ${x}) fail ${err.message}`);
                        });
                }
            }
        }
    });

    await pool.disconnect();
    t.end();
});
