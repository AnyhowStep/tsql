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
            const arr = [
                [BigInt(0), "0"],
                [BigInt(1), "1"],
                [BigInt(2), "10"],
                [BigInt("9223372036854775807"), "111111111111111111111111111111111111111111111111111111111111111"],
                [BigInt(-1), "1111111111111111111111111111111111111111111111111111111111111111"],
                [BigInt(-2), "1111111111111111111111111111111111111111111111111111111111111110"],
                [BigInt("-9223372036854775808"), "1000000000000000000000000000000000000000000000000000000000000000"],
            ] as const;

            for (const [x, b] of arr) {
                await tsql.selectValue(() => tsql.bin(x))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, b, `BIN(${x}) = ${b}`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
