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
                await tsql.selectValue(() => tsql.double.neg(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, -a);
                    })
                    .catch((err) => {
                        t.true(err instanceof tsql.DataOutOfRangeError);
                    });
            }
        });

        t.end();
    });
};
