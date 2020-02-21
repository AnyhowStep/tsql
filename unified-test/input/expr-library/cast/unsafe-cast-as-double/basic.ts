import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -1234,
                -3
                -2,
                -1,
                0,
                1,
                2,
                3,
                1234,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.unsafeCastAsBigIntSigned(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, tm.BigInt(a));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
