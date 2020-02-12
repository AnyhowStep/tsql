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
                 * Make `now0` the seconds since Unix epoch
                 */
                const now0 = Math.floor(new Date().getTime()/1000);

                await tsql
                    .selectValue(() => tsql.unixTimestampNow())
                    .fetchValue(connection)
                    .then((value) => {
                        const now1 = Math.floor(new Date().getTime()/1000);

                        t.true(now0 <= Number(value), `${now0} <= ${value}`);
                        t.true(Number(value) <= now1, `${value} <= ${now1}`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
