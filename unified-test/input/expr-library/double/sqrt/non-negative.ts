import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                0,
                0.123,
                0.5,
                0.752,
                1,
                1.1,
                10,
                10.56,
                20,
                30,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.double.sqrt(a))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = Math.sqrt(a);
                        const margin = 0.000000000000001;

                        if (value == null) {
                            t.fail(`SQRT(${a}) ~= ${expected} ~/= ${value}`);
                            return;
                        }

                        t.true(
                            Math.abs(value - expected) < margin,
                            `SQRT(${a}) ~= ${expected} ~/= ${value}`
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
