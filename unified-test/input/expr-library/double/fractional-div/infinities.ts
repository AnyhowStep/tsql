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
                    await tsql.selectValue(() => tsql.double.fractionalDiv(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            const expected = (
                                !isFinite(a) && !isFinite(b) ?
                                null :
                                a/b
                            );
                            t.deepEqual(
                                value,
                                expected,
                                `(${a}/${b}) ~= ${expected} ~/= ${value}`
                            );
                        })
                        .catch((err) => {
                            t.true(err instanceof tsql.DataOutOfRangeError);
                        });
                }
            }
        });

        t.end();
    });
};
