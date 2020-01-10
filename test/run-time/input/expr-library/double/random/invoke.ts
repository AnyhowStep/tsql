import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("frandom", () => {
            return Math.random();
        });
        for (let x=0; x<1000; ++x) {
            const isOk = await tsql.selectValue(() => tsql.double.random())
                .fetchValue(connection)
                .then((value) => {
                    if (value >= 0 && value < 1) {
                        return true;
                    } else {
                        t.fail(`frandom() === ${value}`);
                        return false;
                    }
                })
                .catch((err) => {
                    t.fail(`${x} ${err.message}`);
                    return false;
                });
            if (!isOk) {
                break;
            }
        }
    });

    await pool.disconnect();t.end();
});
