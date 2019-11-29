import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const timestamps = [
        0,
        1,
        10,
        100,
        1000,
        10000,
        100000,
        12,
        123,
        1234,
        12345,
        123456,
    ];
    for (const timestamp of timestamps) {
        await pool.acquire((connection) => {
            return tsql.selectValue(() => new Date(timestamp))
                .fetchValue(connection);
        }).then((value) => {
            t.deepEqual(
                value,
                new Date(timestamp)
            );
        });
    }

    t.end();
});
