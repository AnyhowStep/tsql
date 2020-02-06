import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let a=0; a<100; ++a) {
                /**
                 * Well... Testing this is a bit hard...
                 * We need this to always generate a valid bigint signed value.
                 *
                 * -9223372036854775808 <= v <= 9223372036854775807
                 *
                 * But to be "sure" we've generated all these numbers and
                 * not generated an invalid value, we'd need to solve the
                 * coupon collectors problem for 2^64 coupons...
                 *
                 * https://en.wikipedia.org/wiki/Coupon_collector%27s_problem
                 *
                 * No way we can wait that long!
                 */
                await tsql
                    .selectValue(() => tsql.integer.randomBigIntSigned())
                    .fetchValue(connection)
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }

        });

        t.end();
    });
};
