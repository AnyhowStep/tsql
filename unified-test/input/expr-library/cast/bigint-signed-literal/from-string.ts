import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.bigIntSignedLiteral("9001"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(9001));
                });

            /**
             * MAX BIGINT SIGNED VALUE
             */
            await tsql.selectValue(() => tsql.bigIntSignedLiteral("9223372036854775807"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("9223372036854775807"));
                });

            /**
             * MIN BIGINT SIGNED VALUE
             */
            await tsql.selectValue(() => tsql.bigIntSignedLiteral("-9223372036854775808"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-9223372036854775808"));
                });

            t.throws(() => {
                /**
                 * Too small
                 */
                tsql.selectValue(() => tsql.bigIntSignedLiteral("-9223372036854775809"));
            });

            t.throws(() => {
                /**
                 * Too big
                 */
                tsql.selectValue(() => tsql.bigIntSignedLiteral("9223372036854775808"));
            });
        });

        t.end();
    });
};
