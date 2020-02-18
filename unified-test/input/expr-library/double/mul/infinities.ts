import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -Infinity,
                -3.141,
                -1,
                -0.5,
                0,
                0.5,
                1,
                3.141,
                Infinity,
            ];
            for (const a of arr) {
                for (const b of arr) {
                    if (isFinite(a) && isFinite(b)) {
                        continue;
                    }
                    await tsql.selectValue(() => tsql.double.mul(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            const expected = a*b;
                            if (isNaN(expected)) {
                                t.deepEqual(value, null);
                            } else {
                                t.deepEqual(value, value);
                            }
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
