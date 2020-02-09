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
            for (let i=0; i<10; ++i) {
                /**
                 * Make `now0` accurate to 0.1-second
                 */
                const now0 = new Date(Math.floor(new Date().getTime()/100) * 100);

                await tsql
                    .selectValue(() => tsql.currentTimestamp1())
                    .fetchValue(connection)
                    .then((value) => {
                        const now1 = new Date();

                        t.true(now0.getTime() <= value.getTime(), `${now0.toISOString()} <= ${value.toISOString()}`);
                        t.true(value.getTime() <= now1.getTime(), `${value.toISOString()} <= ${now1.toISOString()}`);
                        t.deepEqual(value.getUTCMilliseconds()%100, 0, `${value.toISOString()} should be accurate to 0.1-second`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
