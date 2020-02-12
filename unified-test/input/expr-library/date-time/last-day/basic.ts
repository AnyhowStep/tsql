import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                [2016, 1, 31],
                [2016, 2, 29], //2016 is a leap year
                [2016, 3, 31],
                [2016, 4, 30],
                [2016, 5, 31],
                [2016, 6, 30],
                [2016, 7, 31],
                [2016, 8, 31],
                [2016, 9, 30],
                [2016, 10, 31],
                [2016, 11, 30],
                [2016, 12, 31],

                [2017, 1, 31],
                [2017, 2, 28], //2017 is not a leap year
                [2017, 3, 31],
            ] as const;
            for (const [year, month, lastDay] of arr) {
                for (let day=1; day<=lastDay; ++day) {
                    const yearStr = String(year).padStart(4, "0");
                    const monthStr = String(month).padStart(2, "0");
                    const dayStr = String(day).padStart(2, "0");
                    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;

                    await tsql
                        .selectValue(() => tsql.lastDay(tsql.throwIfNull(tsql.utcStringToTimestamp(dateStr))))
                        .fetchValue(connection)
                        .then((value) => {
                            const lastDayStr = String(lastDay).padStart(2, "0");
                            const lastDateStr = `${yearStr}-${monthStr}-${lastDayStr}T00:00:00Z`;
                            t.deepEqual(
                                value,
                                new Date(lastDateStr),
                                `LAST_DAY(${dateStr}) = ${new Date(lastDateStr).toISOString()}`
                            );
                        })
                        .catch((err) => {
                            t.fail(err.message);
                        });
                }
            }
        });

        t.end();
    });
};
