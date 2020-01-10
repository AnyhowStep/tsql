import * as tm from "type-mapping";
import * as tape from "tape";
import {Pool} from "./promise.sql";
import {SqliteWorker} from "./worker.sql";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("takes1", (x) => x);

        const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

        const result = await connection.exec("SELECT typeof(9223372036854775807), takes1(9223372036854775807), 9223372036854775807");
        t.deepEqual(result.execResult[0].values, [ ["integer", BigInt("9223372036854775807"), BigInt("9223372036854775807")] ]);

        /**
         * Overflow
         * 9223372036854775807 is the max bigint signed value.
         */
        const result2 = await connection.exec("SELECT typeof(9223372036854775808), takes1(9223372036854775808), 9223372036854775808");
        t.deepEqual(result2.execResult[0].values, [ ["real", 9223372036854780000, 9223372036854780000] ]);

        const result3 = await connection.exec("SELECT typeof(-9223372036854775808), takes1(-9223372036854775808), -9223372036854775808");
        t.deepEqual(result3.execResult[0].values, [ ["integer", BigInt("-9223372036854775808"), BigInt("-9223372036854775808")] ]);

        /**
         * Overflow
         * -9223372036854775809 is the min bigint signed value.
         */
        const result4 = await connection.exec("SELECT typeof(-9223372036854775809), takes1(-9223372036854775809), -9223372036854775809");
        t.deepEqual(result4.execResult[0].values, [ ["real", -9223372036854780000, -9223372036854780000] ]);
    });

    await pool.disconnect();t.end();
});
