import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -6.566,
                -4,
                -3.141,
                -3,
                -2,
                -1.678,
                -1.5,
                -1.123,
                -1,
                -0.77,
                -0.5,
                0,
                0.5,
                0.77,
                1,
                1.123,
                1.5,
                1.678,
                2,
                3,
                3.141,
                4,
                6.566,
            ];
            for (const a of arr) {
                if (a <= 0) {
                    continue;
                }
                for (const b of arr) {
                    if (Math.floor(b) == b) {
                        continue;
                    }
                    await tsql.selectValue(() => tsql.double.power(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            const expected = Math.pow(a, b);
                            const margin = 0.000000000001;

                            if (value == null) {
                                t.fail(`POWER(${a}, ${b}) ~= ${expected} ~/= ${value}`);
                                return;
                            }

                            t.true(
                                Math.abs(value - expected) <= margin,
                                `POWER(${a}, ${b}) ~= ${expected} ~/= ${value}`
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
