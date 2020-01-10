import * as tm from "type-mapping";
import * as tape from "tape";
import {Pool} from "./promise.sql";
import {SqliteWorker} from "./worker.sql";
//import {log} from "../../../util";

/**
 * https://github.com/kripken/sql.js/issues/296
 *
 * Fix found here,
 * https://github.com/kripken/sql.js/blob/master/src/api.coffee#L484-L495
 */
tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();

        await connection.createFunction("returnZero", () => 0);
        const result = await connection.exec("SELECT returnZero(), 0, 0e0");
        t.deepEqual(result.execResult[0].values, [ [0, BigInt(0), 0] ]);
    });

    await pool.disconnect();t.end();
});
