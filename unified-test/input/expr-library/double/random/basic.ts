import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let a=0; a<100; ++a) {
                /**
                 * Well... Testing this is a bit hard...
                 * We need this to always generate a valid double value.
                 *
                 * 0.0 <= v < 1.0
                 *
                 * But to be "sure" we've generated all these numbers and
                 * not generated an invalid value, we'd need to solve the
                 * coupon collectors problem for a shit tonne of coupons...
                 *
                 * https://en.wikipedia.org/wiki/Coupon_collector%27s_problem
                 *
                 * No way we can wait that long!
                 */
                await tsql
                    .selectValue(() => tsql.double.random())
                    .fetchValue(connection)
                    .then((value) => {
                        t.true(0 <= value, `0 <= ${value}`);
                        t.true(value < 1, `${value} < 1`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }

        });

        t.end();
    });
};
