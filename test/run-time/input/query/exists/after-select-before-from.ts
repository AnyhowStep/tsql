import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire(async (connection) => {
        t.deepEqual(
            await tsql.selectValue(() => 42)
                .exists(
                    connection
                ),
            true
        );

    });

    await pool.disconnect();
    t.end();
});
