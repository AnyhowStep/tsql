import * as tape from "tape";
import * as tsql from "../../../../../../dist";
import {compareSqlPretty} from "../../../../../compare-sql-pretty";
import {compareSql} from "../../../../../compare-sql";
import {Pool} from "../../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const query = tsql.select(() => [
        tsql.double.add(1).as("1"),
        tsql.double.add(1e1).as("1e1"),
        tsql.double.add(1e300).as("1e300"),
        tsql.double.add(1e-5).as("1e-5"),
        tsql.double.add(1e-10).as("1e-10"),
        tsql.double.add(-1).as("-1"),
        tsql.double.add(-1e1).as("-1e1"),
        tsql.double.add(-1e300).as("-1e300"),
        tsql.double.add(-1e-5).as("-1e-5"),
        tsql.double.add(-1e-10).as("-1e-10"),
        tsql.double.add(1.23e300).as("1.23e300"),
        tsql.double.add(-1.23e300).as("-1.23e300"),
        tsql.double.add(1.23e-300).as("1.23e-300"),
        tsql.double.add(-1.23e-300).as("-1.23e-300")
    ]);

    compareSqlPretty(__filename, t, query);
    compareSql(__filename, t, query);

    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        const row = await query.fetchOne(connection);
        /**
         * https://github.com/kripken/sql.js/issues/295
         */
        t.deepEqual(
            row,
            {
                "1" : 1,
                "1e1" : 10,
                "1e300" : 1e300,
                "1e-5" : 0.00001,
                "1e-10" : 0.0000000001,
                "-1" : -1,
                "-1e1" : -10,
                "-1e300" : -1e300,
                "-1e-5" : -0.00001,
                "-1e-10" : -0.0000000001,
                "1.23e300" : 1.23e+300,
                "-1.23e300" : -1.23e+300,
                "1.23e-300" : 1.23e-300,
                "-1.23e-300" : -1.23e-300,
            }
        );
    });

    await pool.disconnect();
    t.end();
});
