import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("atan2", (x, y) => {
            if (typeof x == "number" && typeof y == "number") {
                return Math.atan2(x, y);
            } else {
                throw new Error(`atan2(${typeof x}, ${typeof y}) not implmented`);
            }
        });
        for (let x=-3; x<=3; ++x) {
            for (let y=-3; y<=3; ++y) {
                await tsql.selectValue(() => tsql.double.atan2(x, y))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, Math.atan2(x, y));
                    });
            }
        }
    });

    t.end();
});
