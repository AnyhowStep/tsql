import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const x = 0;
            const arr = [
                0.5,
                1,
                1.1,
                10,
                10.3141,
                20,
                20.6282,
                30,
            ];
            for (const base of arr) {
                if (base == 1) {
                    continue;
                }
                await tsql.selectValue(() => tsql.double.log(base, x))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = null;

                        t.deepEqual(
                            value,
                            expected,
                            `LOG(${base}, ${x}) ~= ${expected} ~/= ${value}`
                        );
                    })
                    .catch((err) => {
                        //@todo Cannot take logarithm of zero error
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
