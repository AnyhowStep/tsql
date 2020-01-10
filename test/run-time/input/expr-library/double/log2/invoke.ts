import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("log2", (x) => {
            if (typeof x == "number") {
                return Math.log2(x);
            } else {
                throw new Error(`log2(${typeof x}) not implmented`);
            }
        });
        for (let x=-1; x<=6; x+=0.25) {
            if (x <= 0) {
                await tsql.selectValue(() => tsql.double.log2(x))
                    .fetchValue(connection)
                    .then((value) => {
                        t.fail(`log2(${x}) === ${value}`);
                    })
                    .catch((_err) => {
                        t.pass();
                    });
            } else {
                await tsql.selectValue(() => tsql.double.log2(x))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, Math.log2(x), x.toString());
                    })
                    .catch((_err) => {
                        t.fail(x.toString());
                    });
            }
        }
    });

    await pool.disconnect();
    t.end();
});
