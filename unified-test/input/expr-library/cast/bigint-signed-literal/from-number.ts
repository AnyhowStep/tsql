import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.bigIntSignedLiteral(9001))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(9001));
                });

            /**
             * MAX_SAFE_INTEGER
             */
            await tsql.selectValue(() => tsql.bigIntSignedLiteral(Number.MAX_SAFE_INTEGER))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(Number.MAX_SAFE_INTEGER));
                });

            /**
             * -MAX_SAFE_INTEGER
             */
            await tsql.selectValue(() => tsql.bigIntSignedLiteral(-Number.MAX_SAFE_INTEGER))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(-Number.MAX_SAFE_INTEGER));
                });

            t.throws(() => {
                /**
                 * Too small
                 */
                tsql.selectValue(() => tsql.bigIntSignedLiteral(-1e300));
            });

            t.throws(() => {
                /**
                 * Too big
                 */
                tsql.selectValue(() => tsql.bigIntSignedLiteral(1e300));
            });

            t.throws(() => {
                /**
                 * Fractional
                 */
                tsql.selectValue(() => tsql.bigIntSignedLiteral(9001.1));
            });
        });

        t.end();
    });
};
