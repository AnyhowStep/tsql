import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire((connection) => {
        return tsql.selectValue(() => 42)
            .map((row) => {
                return {
                    x : row.$aliased.value + 58,
                };
            })
            .fetchOneOr(
                /**
                 * @todo Make `connection` implement `IConnection` properly
                 */
                connection as unknown as tsql.IConnection,
                "Hello, world"
            );
    });
    t.deepEqual(
        resultSet,
        {
            x : 100,
        }
    );

    await pool.disconnect();t.end();
});
