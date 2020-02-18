import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -1e308,
                -3.141,
                -1,
                -0.5,
                0,
                0.5,
                1,
                3.141,
                1e308,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.double.neg(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, -a);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
