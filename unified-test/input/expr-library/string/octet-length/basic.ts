import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.octetLength(""))
                .fetchValue(connection)
                .then((value) => {
                    /**
                     * It shouldn't matter what character set you use.
                     * The octet length of an empty string should always be zero.
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
                for (const b of arr) {
                    await tsql.selectValue(() => tsql.lt(tsql.octetLength(a), tsql.octetLength(b)))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, a.length < b.length, `OCTET_LENGTH(${a}) < OCTET_LENGTH(${b})`);
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
