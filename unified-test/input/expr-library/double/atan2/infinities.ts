import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -Infinity,
                Infinity,
                1,
            ];
            for (const a of arr) {
                for (const b of arr) {
                    if (isFinite(a) && isFinite(b)) {
                        continue;
                    }
                    await tsql.selectValue(() => tsql.double.atan2(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            const expected = Math.atan2(a, b);
                            const margin = 0.000000000000001;
                            t.true(
                                Math.abs(value - expected) < margin,
                                `ATAN2(${a}, ${b}) ~= ${Math.atan2(a, b)} ~/= ${value}`
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
