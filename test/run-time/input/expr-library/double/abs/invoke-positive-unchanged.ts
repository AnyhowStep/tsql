import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await tsql.selectValue(() => tsql.double.abs(123.456))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 123.456);
            });
        await tsql.selectValue(() => tsql.double.abs(tsql.double.abs(0.00001)))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 0.00001);
            });
    });

    await pool.disconnect();
    t.end();
});
