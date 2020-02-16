import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("asin", (x) => {
            if (typeof x == "number") {
                return Math.asin(x);
            } else {
                throw new Error(`asin(${typeof x}) not implmented`);
            }
        });
        await tsql.selectValue(() => tsql.double.asin(1))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, Math.asin(1));
            });

        await tsql.selectValue(() => tsql.double.asin(0.5))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, Math.asin(0.5));
            });
        await tsql.selectValue(() => tsql.double.asin(-123.456))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, null);
            })
            .catch((err) => {
                t.fail(err.message);
            });
    });

    await pool.disconnect();
    t.end();
});
