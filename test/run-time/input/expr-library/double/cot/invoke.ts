import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("cot", (x) => {
            if (typeof x == "number") {
                return 1/Math.tan(x);
            } else {
                throw new Error(`cot(${typeof x}) not implmented`);
            }
        });
        for (let x=-6; x<=6; x+=0.25) {
            if (x == 0) {
                await tsql.selectValue(() => tsql.double.cot(x))
                    .fetchValue(connection)
                    .then(() => {
                        t.fail(x.toString());
                    })
                    .catch((err) => {
                        t.pass(err.message);
                    });
            } else {
                await tsql.selectValue(() => tsql.double.cot(x))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, 1/Math.tan(x), x.toString());
                    })
                    .catch((_err) => {
                        t.fail(x.toString());
                    });
            }
        }
    });

    t.end();
});
