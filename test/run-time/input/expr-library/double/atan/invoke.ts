import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("atan", (x) => {
            if (typeof x == "number") {
                return Math.atan(x);
            } else {
                throw new Error(`atan(${typeof x}) not implmented`);
            }
        });
        await tsql.selectValue(() => tsql.double.atan(1))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, Math.atan(1));
            });

        await tsql.selectValue(() => tsql.double.atan(0.5))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, Math.atan(0.5));
            });
        await tsql.selectValue(() => tsql.double.atan(-123.456))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, Math.atan(-123.456));
            });
    });

    await pool.disconnect();
    t.end();
});
