import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("floor", (x) => {
            if (typeof x == "number") {
                return Math.floor(x);
            } else {
                throw new Error(`floor(${typeof x}) not implmented`);
            }
        });
        await tsql.selectValue(() => tsql.double.floor(123.456))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 123);
            });
        await tsql.selectValue(() => tsql.double.floor(-123.456))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, -124);
            });
    });

    await pool.disconnect();
    t.end();
});
