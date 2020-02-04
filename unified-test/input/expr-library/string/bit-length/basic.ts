import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.bitLength(""))
                .fetchValue(connection)
                .then((value) => {
                    /**
                     * It shouldn't matter what character set you use.
                     * The bit length of an empty string should always be zero.
                     */
                    t.deepEqual(value, BigInt(0));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            const arr = [
                "",
                "a",
                "ab",
                "abc",
                "abcd",
            ] as const;

            for (const a of arr) {
                await tsql.selectValue(() => tsql.bitLength(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(tm.BigIntUtil.mod(value, 8), BigInt(0), `BIT_LENGTH(${a}) % 8 = 0`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });

                for (const b of arr) {
                    await tsql.selectValue(() => tsql.lt(tsql.bitLength(a), tsql.bitLength(b)))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, a.length < b.length, `BIT_LENGTH(${a}) < BIT_LENGTH(${b})`);
                        })
                        .catch((err) => {
                            t.fail(err.message);
                        });
                }
            }
        });

        t.end();
    });
};
