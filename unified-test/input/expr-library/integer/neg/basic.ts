import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let a=-4; a<=4; ++a) {
                await tsql
                    .selectValue(() => tsql.integer.neg(
                        BigInt(a)
                    ))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, BigInt(-a), `-${a} = ${-a}`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }

        });

        t.end();
    });
};
