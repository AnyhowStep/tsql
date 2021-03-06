import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let a=-4; a<=4; ++a) {
                await tsql
                    .selectValue(() => tsql.integer.sign(
                        BigInt(a)
                    ))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = BigInt(
                            a > 0 ?
                            1 :
                            a < 0 ?
                            -1 :
                            0
                        );
                        t.deepEqual(value, expected, `SIGN(${a}) = ${expected}`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }

        });

        t.end();
    });
};
