import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("acos", (x) => {
            if (typeof x == "number") {
                return Math.acos(x);
            } else {
                throw new Error(`acos(${typeof x}) not implmented`);
            }
        });
        await tsql.selectValue(() => tsql.double.acos(1))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, Math.acos(1));
            });

        await tsql.selectValue(() => tsql.double.acos(0.5))
            .fetchValue(connection)
            .then((value) => {
                /**
                 * From SQLite  : 1.0471975511965979
                 * From JS      : 1.0471975511965979
                 */
                t.deepEqual(value, 1.0471975511965979);
            });
        await tsql.selectValue(() => tsql.double.acos(-123.456))
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
