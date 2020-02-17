import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -30,
                -20.6282,
                -20,
                -10.3141,
                -10,
                -1.1,
                -1,
                -0.5,
                0,
                0.5,
                1,
                1.1,
                10,
                10.3141,
                20,
                20.6282,
                30,
            ];
            for (const a of arr) {
                for (const b of arr) {
                    if (b == 0) {
                        continue;
                    }
                    await tsql.selectValue(() => tsql.double.integerDiv(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            const expected = tm.BigInt(Math.trunc(a/b));
                            if (value == null) {
                                t.fail(`(${a} DIV ${b}) ~= ${expected} ~/= ${value}`);
                                return;
                            }

                            t.deepEqual(
                                value,
                                expected,
                                `(${a} DIV ${b}) ~= ${expected} ~/= ${value}`
                            );
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
