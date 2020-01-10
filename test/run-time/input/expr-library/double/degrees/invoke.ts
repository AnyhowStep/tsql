import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("degrees", (x) => {
            if (typeof x == "number") {
                return x * 180/Math.PI;
            } else {
                throw new Error(`degrees(${typeof x}) not implmented`);
            }
        });
        for (let x=-6; x<=6; x+=0.25) {
            await tsql.selectValue(() => tsql.double.degrees(x))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, x * 180/Math.PI, x.toString());
                })
                .catch((_err) => {
                    t.fail(x.toString());
                });
        }
    });

    await pool.disconnect();
    t.end();
});
