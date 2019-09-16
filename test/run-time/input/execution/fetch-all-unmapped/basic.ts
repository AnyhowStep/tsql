import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire((connection) => {
        return tsql.ExecutionUtil.fetchAllUnmapped(
            tsql.selectValue(() => 42),
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
                __aliased : {
                    value : 42,
                }
            }
        ]
    );

    t.end();
});
