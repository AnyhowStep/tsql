import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

/**
 * This test has an elevated risk of Heisenbugs.
 *
 * https://github.com/AnyhowStep/tsql/issues/214
 */
export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const now0 = new Date();

            await tsql
                .selectValue(() => tsql.currentDate())
                .fetchValue(connection)
                .then((value) => {
                    const now1 = new Date();

                    t.deepEqual(value.getUTCHours(), 0);
                    t.deepEqual(value.getUTCMinutes(), 0);
                    t.deepEqual(value.getUTCSeconds(), 0);
                    t.deepEqual(value.getUTCMilliseconds(), 0);

                    if (
                        now0.getUTCFullYear() == now1.getUTCFullYear() &&
                        now0.getUTCMonth() == now1.getUTCMonth() &&
                        now0.getUTCDate() == now1.getUTCDate()
                    ) {
                        /**
                         * The date has not changed since the start of the test.
                         */
                        t.deepEqual(
                            now0.getUTCFullYear(),
                            value.getUTCFullYear()
                        );
                        t.deepEqual(
                            now0.getUTCMonth(),
                            value.getUTCMonth()
                        );
                        t.deepEqual(
                            now0.getUTCDate(),
                            value.getUTCDate()
                        );
                    } else {
                        /**
                         * The date changed...
                         * How lucky.
                         */
                        if (
                            now0.getUTCFullYear() == value.getUTCFullYear() &&
                            now0.getUTCMonth() == value.getUTCMonth() &&
                            now0.getUTCDate() == value.getUTCDate()
                        ) {
                            t.pass();
                        } else if (
                            now1.getUTCFullYear() == value.getUTCFullYear() &&
                            now1.getUTCMonth() == value.getUTCMonth() &&
                            now1.getUTCDate() == value.getUTCDate()
                        ) {
                            t.pass();
                        } else {
                            t.fail(`Expected date-component of ${value.toISOString()} to be the date-component of ${now0.toISOString()} or ${now1.toISOString()}`);
                        }
                    }
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
