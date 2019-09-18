import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    await pool.acquire((connection) => {
        return tsql.selectValue(() => 42 as number)
            .unionDistinct(
                tsql.selectValue(() => 99)
            )
            .compoundQueryOrderBy(columns => [
                columns.value.desc(),
            ])
            .fetchOne(
                /**
                 * @todo Make `connection` implement `IConnection` properly
                 */
                connection as unknown as tsql.IConnection
            );
    }).then(() => {
        t.fail("Expected to fail");
    }).catch((err) => {
        t.true(err instanceof tsql.TooManyRowsFoundError);
        t.deepEqual(err.name, "TooManyRowsFoundError");
        t.deepEqual(err.sql, `SELECT 42 AS "__aliased--value" UNION SELECT 99 AS "__aliased--value" ORDER BY "__aliased--value" DESC LIMIT 2 OFFSET 0`);
    });

    t.end();
});
