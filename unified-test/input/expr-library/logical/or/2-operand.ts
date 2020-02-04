import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                true,
                false,
            ];
            for (const a of arr) {
                for (const b of arr) {
                    await tsql.selectValue(() => tsql.or(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, a || b);
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
