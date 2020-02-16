import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("log10", (x) => {
            if (typeof x == "number") {
                const result = Math.log10(x);
                if (result == -Infinity) {
                    return null;
                } else {
                    return result;
                }
            } else {
                throw new Error(`log10(${typeof x}) not implmented`);
            }
        });
        for (let x=-1; x<=6; x+=0.25) {
            if (x <= 0) {
                await tsql.selectValue(() => tsql.double.log10(x))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, null);
                    })
                    .catch((err) => {
                        t.fail(`${x}: ${err.message}`);
                    });
            } else {
                await tsql.selectValue(() => tsql.double.log10(x))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, Math.log10(x), x.toString());
                    })
                    .catch((_err) => {
                        t.fail(x.toString());
                    });
            }
        }
    });

    await pool.disconnect();
    t.end();
});
