import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const resultSet = await pool.acquire((connection) => {
        return tsql.selectValue(() => 42)
            .fetchAll(
                connection
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

    t.end();
});