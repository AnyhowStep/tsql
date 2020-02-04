import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -1,
                -0.5,
                0,
                0.5,
                1,
                1.5,
            ];
            for (const a of arr) {
                for (const b of arr) {
                    await tsql.selectValue(() => tsql.gt(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, a > b);
                        })
                        .catch((err) => {
                            t.pass(err.message);
                        });
                }
            }
        });

        t.end();
    });
};
