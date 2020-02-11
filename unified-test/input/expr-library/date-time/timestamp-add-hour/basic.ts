import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {lastDay} from "../timestamp-add-month/mysql-add-months";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let year=2015; year<=2016; ++year) {
                for (const month of [1, 2, 6, 11, 12]) {
                    const lastDayOfMonth = lastDay(year, month);
                    const days = [1,2];
                    for (let day=26; day<=lastDayOfMonth; ++day) {
                        days.push(day);
                    }
                    for (const day of days) {
                        for (let hour=0; hour<=23; ++hour) {
                            for (let deltaHour=-73; deltaHour<=73; ++deltaHour) {
                                const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                                const timeStr = `${String(hour).padStart(2, "0")}:43:23.756`;
                                await tsql
                                    .selectValue(() => tsql.timestampAddHour(
                                        BigInt(deltaHour),
                                        tsql.utcStringToTimestamp(`${dateStr} ${timeStr}`)
                                    ))
                                    .fetchValue(connection)
                                    .then((value) => {
                                        const startDateTime = new Date(`${dateStr}T${timeStr}Z`);
                                        const startTimestamp = startDateTime.getTime();
                                        const expected = new Date(startTimestamp + (deltaHour * 60 * 60 * 1000));
                                        t.deepEqual(value, expected, `TIMESTAMPADD(HOUR, ${deltaHour}, '${dateStr} ${timeStr}') = ${expected.toISOString()}`);
                                    })
                                    .catch((err) => {
                                        t.fail(String(err));
                                    });
                            }
                        }
                    }
                }
            }
        });

        t.end();
    });
};
