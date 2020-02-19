import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -1e308,
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
                1e308,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.double.sign(a))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = (
                            a > 0 ?
                            1 :
                            a < 0 ?
                            -1 :
                            0
                        );
                        t.deepEqual(
                            value,
                            expected,
                            `SIGN(${a}) ~= ${expected} ~/= ${value}`
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
