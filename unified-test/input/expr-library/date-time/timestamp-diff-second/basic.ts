import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {lastDay} from "../timestamp-add-month/mysql-add-months";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const from = new Date("2016-04-23T16:23:55.112Z");
            for (let year=2015; year<=2017; ++year) {
                for (let month=1; month<=12; month+=5) {
                    const lastDayOfMonth = lastDay(year, month);
                    for (let day=26; day<=lastDayOfMonth; ++day) {
                        for (let hour=0; hour<=23; hour+=5) {
                            for (let minute=0; minute<=59; minute+=17) {
                                for (let second=0; second<=59; second+=13) {
                                    for (let millisecond=0; millisecond<=999; millisecond+=173) {
                                        const to = new Date(`${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}.${String(millisecond).padStart(3, "0")}Z`);
                                        await tsql
                                            .selectValue(() => tsql.timestampDiffSecond(
                                                from,
                                                to
                                            ))
                                            .fetchValue(connection)
                                            .then((value) => {
                                                const expected = Math.trunc((to.getTime()-from.getTime())/1000);
                                                t.deepEqual(value, BigInt(expected), `TIMESTAMPDIFF(SECOND, ${from.toISOString()}, ${to.toISOString()}) = ${expected}`);
                                            })
                                            .catch((err) => {
                                                t.fail(String(err));
                                            });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        t.end();
    });
};
