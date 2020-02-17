import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        for (let x=-5; x<=5; x+=0.25) {
            for (let y=-5; y<=5; y+=0.25) {
                await tsql.select(() => [
                    tsql.double.integerDiv(x, y).as("q"),
                    tsql.double.integerRemainder(x, y).as("r")
                ])
                    .fetchOne(connection)
                    .then(({q, r}) => {
                        if (Math.trunc(y) == 0) {
                            t.deepEqual(q, null);
                            t.deepEqual(r, null);
                            return;
                        }
                        t.deepEqual(
                            q,
                            Math.trunc(Math.trunc(x) / Math.trunc(y))
                        );
                        t.deepEqual(
                            r,
                            Math.trunc(x) % Math.trunc(y)
                        );
                        if (q == null || r == null) {
                            t.fail("Should not be null");
                            return;
                        }
                        t.deepEqual(
                            Math.trunc(y) * q + r,
                            Math.trunc(x)
                        );
                    });
            }
        }
    });

    await pool.disconnect();
    t.end();
});
