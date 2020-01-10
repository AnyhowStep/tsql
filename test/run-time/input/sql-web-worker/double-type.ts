import * as tape from "tape";
import {Pool} from "./promise.sql";
import {SqliteWorker} from "./worker.sql";
//import {log} from "../../../util";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());
    await pool.acquire(async (connection) => {
        await connection.createFunction("takes1", (x) => x);

        for (let i=0; i<=308; ++i) {
            await connection.exec(`SELECT 1e${i}`)
                .then((r) => {
                    t.deepEqual(r.execResult[0].values[0][0], parseFloat(`1e${i}`));
                });
        }

        for (let i=0; i<=132; ++i) {
            await connection.exec(`SELECT 1e-${i}`)
                .then((r) => {
                    t.deepEqual(r.execResult[0].values[0][0], parseFloat(`1e-${i}`));
                });
        }

        for (let i=0; i<=308; ++i) {
            await connection.exec(`SELECT -1e${i}`)
                .then((r) => {
                    t.deepEqual(r.execResult[0].values[0][0], parseFloat(`-1e${i}`));
                });
        }

        for (let i=0; i<=132; ++i) {
            await connection.exec(`SELECT -1e-${i}`)
                .then((r) => {
                    t.deepEqual(r.execResult[0].values[0][0], parseFloat(`-1e-${i}`));
                });
        }

        const result = await connection.exec("SELECT typeof(1e308), takes1(1e308), 1e308");
        t.deepEqual(result.execResult[0].values, [ ["real", 1e308, 1e308] ]);

        const result2 = await connection.exec("SELECT typeof(1e-323), takes1(1e-323), 1e-323");
        t.deepEqual(result2.execResult[0].values, [ ["real", 1e-323, 1e-323] ]);

        const result3 = await connection.exec("SELECT typeof(1e-324), takes1(1e-324), 1e-324");
        t.deepEqual(result3.execResult[0].values, [ ["real", 0, 0] ]);

        const result4 = await connection.exec("SELECT typeof(-1e308), takes1(-1e308), -1e308");
        t.deepEqual(result4.execResult[0].values, [ ["real", -1e308, -1e308] ]);

        /**
         * Losing precision,
         * https://github.com/kripken/sql.js/issues/295
         */
        const result5 = await connection.exec("SELECT typeof(1.0471975511965979), takes1(1.0471975511965979), 1.0471975511965979");
        t.deepEqual(result5.execResult[0].values, [ ["real", 1.047197551196598, 1.047197551196598] ]);

        await connection.exec("SELECT typeof(-1e309), takes1(-1e309), -1e309")
            .then(() => {
                t.fail("Should result in -Infinity and throw error");
            })
            .catch(() => {
                t.pass();
            });

        await connection.exec("SELECT typeof(1e309), takes1(1e309), 1e309")
            .then(() => {
                t.fail("Should result in +Infinity and throw error");
            })
            .catch(() => {
                t.pass();
            });

        await connection.exec("SELECT typeof(-1e309), -1e309")
            .then(() => {
                t.fail("Should result in -Infinity and throw error");
            })
            .catch(() => {
                t.pass();
            });

        await connection.exec("SELECT typeof(1e309), 1e309")
            .then(() => {
                t.fail("Should result in +Infinity and throw error");
            })
            .catch(() => {
                t.pass();
            });

        await connection.exec("SELECT 1e0/0e0")
            .then((r) => {
                t.deepEqual(r.execResult[0].values, [[null]]);
            })
            .catch(() => {
                t.fail("Should result in null");
            });

    });

    await pool.disconnect();t.end();
});
