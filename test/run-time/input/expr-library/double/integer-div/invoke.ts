import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        for (let x=-5; x<=5; ++x) {
            for (let y=-5; y<=5; y+=0.25) {
                await tsql.selectValue(() => tsql.double.integerDiv(x, y))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = Math.trunc(y) == 0 ?
                            null :
                            Math.trunc(Math.trunc(x) / Math.trunc(y));
                        t.deepEqual(value, expected, `${x}/${y}`);
                    });
            }
        }
    });

    t.end();
});
