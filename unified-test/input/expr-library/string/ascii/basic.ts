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

            /**
             * @todo MySQL can't seem to handle [128. 255].
             * It always gives back the wrong value.
             */
            for (let i=1; i<=127; ++i) {
                await tsql.selectValue(() => String.fromCharCode(i))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, String.fromCharCode(i), `CHAR(${i}) = '${String.fromCharCode(i)}'`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });

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
