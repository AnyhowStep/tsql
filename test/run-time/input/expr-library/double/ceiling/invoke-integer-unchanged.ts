import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("ceiling", (x) => {
            if (typeof x == "number") {
                return Math.ceil(x);
            } else {
                throw new Error(`ceiling(${typeof x}) not implmented`);
            }
        });
        await tsql.selectValue(() => tsql.double.ceiling(124))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 124);
            });
        await tsql.selectValue(() => tsql.double.ceiling(-123))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, -123);
            });
    });

    t.end();
});
