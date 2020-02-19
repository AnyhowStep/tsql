import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const a = 0;
            const b = 0;
            await tsql.selectValue(() => tsql.double.power(a, b))
                .fetchValue(connection)
                .then((value) => {
                    const expected = 1;
                    t.deepEqual(
                        value,
                        expected,
                        `POWER(${a}, ${b}) ~= ${expected} ~/= ${value}`
                    );
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
