import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire((connection) => {
        return tsql.selectValue(() => 42 as number)
            .unionDistinct(
                tsql.selectValue(() => 99)
            )
            .compoundQueryOrderBy(columns => [
                columns.value.desc(),
            ])
            .compoundQueryLimit(1)
            .fetchValue(
                /**
                 * @todo Make `connection` implement `IConnection` properly
                 */
                connection as unknown as tsql.IConnection
            );
    });
    t.deepEqual(
        resultSet,
        99
    );

    await pool.disconnect();
    t.end();
});
