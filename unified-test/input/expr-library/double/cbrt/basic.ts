import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -30,
                -20,
                -10,
                -1,
                -0.5,
                0,
                0.5,
                1,
                10,
                20,
                30,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.double.cbrt(a))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = Math.cbrt(a);
                        const margin = 0.000000000000001;
                        t.true(
                            Math.abs(value - expected) < margin,
                            `CBRT(${a}) ~= ${expected} ~/= ${value}`
                        );
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
