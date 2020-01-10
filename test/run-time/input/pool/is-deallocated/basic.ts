import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    t.deepEqual(pool.isDeallocated(), false);

    await pool.acquire(async (connection) => {
        await tsql.selectValue(() => 42)
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 42);
            });
    });

    t.deepEqual(pool.isDeallocated(), false);
    const disconnectPromise = pool.disconnect();
    t.deepEqual(pool.isDeallocated(), true);

    await disconnectPromise;
    t.deepEqual(pool.isDeallocated(), true);

    await pool.acquire(async () => {
        t.fail("Should not be able to acquire connection");
    }).catch(() => {
        t.pass("Cannot acquire connection from disconnected pool");
    });

    t.end();
});
