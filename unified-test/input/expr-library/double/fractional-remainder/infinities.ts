import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -Infinity,
                Infinity,
                1,
                -1,
                0,
                2,
                -2,
            ];
            for (const a of arr) {
                for (const b of arr) {
                    if (b == 0) {
                        continue;
                    }
                    const expected = (
                        !isFinite(a) ?
                        null :
                        a%b
                    );
                    await tsql.selectValue(() => tsql.double.fractionalRemainder(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(
                                value,
                                expected,
                                `(${a}%${b}) ~= ${expected} ~/= ${value}`
                            );
                        })
                        .catch((err) => {
                            if (!(err instanceof tsql.DataOutOfRangeError)) {
                                t.fail(`(${a}%${b}) ~= ${expected}` + "\n" + err.message + "\n" + err.stack);
                            }
                            t.true(err instanceof tsql.DataOutOfRangeError);
                        });
                }
            }
        });

        t.end();
    });
};
