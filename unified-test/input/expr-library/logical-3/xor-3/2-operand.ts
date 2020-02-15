import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                true,
                false,
                null
            ];
            for (const a of arr) {
                for (const b of arr) {
                    await tsql.selectValue(() => tsql.xor3(a, b))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(
                                value,
                                (
                                    (a == null || b == null) ?
                                    null :
                                    a != b
                                ),
                                `${a} XOR ${b}`
                            );
                        })
                        .catch((err) => {
                            t.fail(err.message);
                        });
                }
            }
        });

        t.end();
    });
};
