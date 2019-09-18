import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire((connection) => {
        return tsql.selectValue(() => 42)
            .limit(0)
            .fetchValue(
                /**
                 * @todo Make `connection` implement `IConnection` properly
                 */
                connection as unknown as tsql.IConnection
            );
    }).then(() => {
        t.fail("Expected to fail");
    }).catch((err) => {
        t.true(err instanceof tsql.RowNotFoundError);
        t.deepEqual(err.name, "RowNotFoundError");
        t.deepEqual(err.sql, `SELECT 42 AS "__aliased--value" LIMIT 0 OFFSET 0`);
    });

    t.end();
});
