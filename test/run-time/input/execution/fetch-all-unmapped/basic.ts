import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {sqliteSqlfier} from "../../../../sqlite-sqlfier";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire((connection) => {
        return tsql.QueryBaseUtil.fetchAllUnmapped(
            tsql.selectValue(() => 42),
            sqliteSqlfier,
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
