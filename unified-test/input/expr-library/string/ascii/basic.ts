import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

/**
 * We don't test the `NUL` character here because
 * different databases have different ways of creating a string with a null character.
 *
 * + MySQL      : `\0`
 * + PostgreSQL : `NUL` CHARACTER NOT SUPPORTED; no escape sequence, `CHR(0)` throws.
 * + SQLite     : `CHAR(0)`
 */
export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.ascii(''))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(0));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            for (let i=1; i<=255; ++i) {
                await tsql.selectValue(() => String.fromCharCode(i))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, String.fromCharCode(i), `CHAR(${i}) = '${String.fromCharCode(i)}'`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }

            /**
             * We do not test 128-255 because the character set of the string can
             * affect the results.
             *
             * For example, on MySQL,
             * + `ASCII(CHAR(128 USING latin1)` is `128`
             *   + `CHAR(128 USING latin1)` takes up **1** byte
             * + `ASCII(CHAR(128 USING utf8mb4)` is `194`
             *   + `CHAR(128 USING utf8mb4)` takes up **2** bytes
             */
            for (let i=1; i<=127; ++i) {
                await tsql.selectValue(() => tsql.ascii(String.fromCharCode(i)))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, BigInt(i), `ASCII(CHAR(${i})) = ASCII('${String.fromCharCode(i)}')`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
