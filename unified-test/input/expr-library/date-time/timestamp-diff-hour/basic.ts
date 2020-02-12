import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {lastDay} from "../timestamp-add-month/mysql-add-months";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const from = new Date("2016-04-23T16:23:55.112Z");
            for (let year=2015; year<=2017; ++year) {
                for (let month=1; month<=12; ++month) {
                    const lastDayOfMonth = lastDay(year, month);
                    for (let day=26; day<=lastDayOfMonth; ++day) {
                        for (let hour=0; hour<=23; ++hour) {
                            const to = new Date(`${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:44:23.654Z`);
                            await tsql
                                .selectValue(() => tsql.timestampDiffHour(
                                    from,
                                    to
                                ))
                                .fetchValue(connection)
                                .then((value) => {
                                    const expected = Math.trunc((to.getTime()-from.getTime())/60/60/1000);
                                    t.deepEqual(value, BigInt(expected), `TIMESTAMPDIFF(HOUR, ${from.toISOString()}, ${to.toISOString()}) = ${expected}`);
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
