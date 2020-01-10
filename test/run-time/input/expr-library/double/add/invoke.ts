import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await tsql.selectValue(() => tsql.double.add(1, 2, 3))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 6);
            });
        await tsql.selectValue(() => tsql.double.add(1e4, 1e5, 123.456e2))
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 1e4 + 1e5 + 123.456e2);
            });
    });

    await pool.disconnect();
    t.end();
});
