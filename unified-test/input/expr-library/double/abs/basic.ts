import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -3.141,
                -2,
                0,
                2,
                3.141
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.double.abs(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, Math.abs(a));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
