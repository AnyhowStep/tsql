import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        for (let x=-3; x<=3; x+=0.25) {
            for (let y=-3; y<=3; y+=0.25) {
                if (y == 0) {
                    await tsql.selectValue(() => tsql.double.fractionalDiv(x, y))
                        .fetchValue(connection)
                        .then((value) => {
                            t.fail(value.toString());
                        })
                        .catch(() => {
                            t.pass();
                        });
                } else {
                    await tsql.selectValue(() => tsql.double.fractionalDiv(x, y))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, x/y);
                        });
                }
            }
        }
    });

    await pool.disconnect();t.end();
});
