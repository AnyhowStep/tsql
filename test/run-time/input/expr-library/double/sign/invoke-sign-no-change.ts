import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await tsql.selectValue(() => tsql.double.sign(-1))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, -1);
            });
        await tsql.selectValue(() => tsql.double.sign(0))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 0);
            });
        await tsql.selectValue(() => tsql.double.sign(1))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 1);
            });
    });

    await pool.disconnect();t.end();
});
