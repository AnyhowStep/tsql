import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const a = 0;
            const arr = [
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
            for (const b of arr) {
                await tsql.selectValue(() => tsql.double.power(a, b))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = 0;
                        t.deepEqual(
                            value,
                            expected,
                            `POWER(${a}, ${b}) ~= ${expected} ~/= ${value}`
                        );
                    })
                    .catch((err) => {
                        t.true(err instanceof tsql.DataOutOfRangeError);
                    });
            }
        });

        t.end();
    });
};
