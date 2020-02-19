import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -Infinity,
                Infinity,
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
                        t.true(err instanceof tsql.DataOutOfRangeError);
                    });
            }
        });

        t.end();
    });
};
