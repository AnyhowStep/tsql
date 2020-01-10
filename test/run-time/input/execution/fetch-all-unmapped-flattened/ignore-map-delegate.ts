import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire((connection) => {
        return tsql.ExecutionUtil.fetchAllUnmappedFlattened(
            tsql.selectValue(() => 42)
                .map(() => undefined),
            /**
             * @todo Make `connection` implement `IConnection` properly
             */
            connection as unknown as tsql.IConnection
        );
    });
    t.deepEqual(
        resultSet,
        [
            {
                value : 42,
            }
        ]
    );

    await pool.disconnect();t.end();
});
