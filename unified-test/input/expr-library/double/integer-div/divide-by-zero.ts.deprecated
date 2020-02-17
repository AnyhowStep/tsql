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
                await tsql.selectValue(() => tsql.double.integerDiv(a, 0))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(
                            value,
                            null,
                            `(${a} DIV 0) ~= ${null} ~/= ${value}`
                        );
                    })
                    .catch((err) => {
                        t.true(err instanceof tsql.DivideByZeroError);
                    });
            }
        });

        t.end();
    });
};
