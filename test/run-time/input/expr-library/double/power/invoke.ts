import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("power", (x, y) => {
            if (typeof x == "number" && typeof y == "number") {
                return Math.pow(x, y);
            } else {
                throw new Error(`power(${typeof x}, ${typeof y}) not implmented`);
            }
        });
        for (let x=-5; x<=5; x+=0.25) {
            for (let y=-5; y<=5; y+=0.25) {
                if (
                    /**
                     * a negative number raised to a non-integer power yields a complex result
                     */
                    (x < 0 && Math.floor(y) != y) ||
                    /**
                     * zero raised to a negative power is undefined
                     */
                    (x == 0 && y < 0)
                ) {
                    await tsql.selectValue(() => tsql.double.power(x, y))
                        .fetchValue(connection)
                        .then((value) => {
                            t.fail(`power(${x}, ${y}) === ${value}`);
                        })
                        .catch(() => {
                            t.pass();
                        });
                } else {
                    await tsql.selectValue(() => tsql.double.power(x, y))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, Math.pow(x, y));
                        })
                        .catch((err) => {
                            t.fail(`power(${x}, ${y}) ${err.message}`);
                        });
                }
            }
        }
    });

    t.end();
});
