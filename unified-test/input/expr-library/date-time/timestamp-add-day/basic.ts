import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {lastDay} from "../timestamp-add-month/mysql-add-months";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let year=2015; year<=2016; ++year) {
                for (let month=1; month<=12; ++month) {
                    const lastDayOfMonth = lastDay(year, month);
                    for (let deltaDay=-400; deltaDay<=400; ++deltaDay) {
                        for (let curDay=26; curDay<=lastDayOfMonth; ++curDay) {
                            await tsql
                                .selectValue(() => tsql.timestampAddDay(
                                    BigInt(deltaDay),
                                    tsql.throwIfNull(tsql.utcStringToTimestamp(`${year}-${String(month).padStart(2, "0")}-${String(curDay).padStart(2, "0")} 16:43:23.756`))
                                ))
                                .fetchValue(connection)
                                .then((value) => {
                                    const startDateTime = new Date(`${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(curDay).padStart(2, "0")}T16:43:23.756Z`);
                                    const startTimestamp = startDateTime.getTime();
                                    const expected = new Date(startTimestamp + (deltaDay * 24 * 60 * 60 * 1000));
                                    t.deepEqual(value, expected, `TIMESTAMPADD(DAY, ${deltaDay}, ${year}-${String(month).padStart(2, "0")}-${String(curDay).padStart(2, "0")} 16:43:23.756) = ${expected.toISOString()}`);
                                })
                                .catch((err) => {
                                    t.fail(String(err));
                                });
                        }
                    }
                }
            }
        });

        t.end();
    });
};
