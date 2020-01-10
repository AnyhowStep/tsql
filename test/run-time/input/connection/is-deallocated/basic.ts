import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    let leaked : tsql.IConnection|undefined;
    await pool.acquire(async (connection) => {
        t.deepEqual(connection.isDeallocated(), false);
        await tsql.selectValue(() => 42)
            .fetchValue(connection)
            .then((value) => {
                t.deepEqual(value, 42);
            });
        leaked = connection;
    });

    if (leaked == undefined) {
        t.fail("Expected leaked connection");
    } else {
        t.deepEqual(leaked.isDeallocated(), true);
        await tsql.selectValue(() => 42)
            .fetchValue(leaked)
            .then(() => {
                t.fail("Shouldn't use leaked connection");
            })
            .catch(() => {
                t.pass("Cannot use leaked connection");
            });
    }

    t.end();
});
