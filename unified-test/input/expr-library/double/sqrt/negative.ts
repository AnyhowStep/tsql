import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
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
                await tsql.selectValue(() => tsql.double.sqrt(-a))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = null;
                        t.deepEqual(
                            value,
                            null,
                            `SQRT(${a}) ~= ${expected} ~/= ${value}`
                        );
                    })
                    .catch((err) => {
                        //@todo Cannot take square root of negative number error
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
