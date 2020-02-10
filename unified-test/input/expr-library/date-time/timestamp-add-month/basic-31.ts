import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {mysqlAddMonths, lastDay} from "./mysql-add-months";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                -101,
                -999,
                -1000,
                -2000,
                -2018,
                101,
                999,
                1000,
                2000,
                2018,
            ];
            for (const month of arr) {
                await tsql
                    .selectValue(() => tsql.timestampAddMonth(
                        BigInt(month),
                        tsql.utcStringToTimestamp(`2018-01-31 16:43:23.756`)
                    ))
                    .fetchValue(connection)
                    .then((value) => {
                        const [expectedYear, expectedMonth, expectedDay] = mysqlAddMonths(2018, 1, 31, month);
                        const expected = new Date(`${String(expectedYear).padStart(4, "0")}-${String(expectedMonth).padStart(2, "0")}-${String(expectedDay).padStart(2, "0")}T16:43:23.756Z`);
                        t.deepEqual(value, expected, `TIMESTAMPADD(MONTH, ${month}, 2018-01-31 16:43:23.756) = ${expected.toISOString()}`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
            for (let year=2015; year<=2021; ++year) {
                for (let month=1; month<=12; ++month) {
                    const lastDayOfMonth = lastDay(year, month);
                    for (let deltaMonth=-50; deltaMonth<=50; ++deltaMonth) {
                        for (let curDay=27; curDay<=lastDayOfMonth; ++curDay) {
                            const [expectedYear, expectedMonth, expectedDay] = mysqlAddMonths(year, month, curDay, deltaMonth);
                            await tsql
                                .selectValue(() => tsql.timestampAddMonth(
                                    BigInt(deltaMonth),
                                    tsql.utcStringToTimestamp(`${year}-${String(month).padStart(2, "0")}-${String(curDay).padStart(2, "0")} 16:43:23.756`)
                                ))
                                .fetchValue(connection)
                                .then((value) => {
                                    const expected = new Date(`${String(expectedYear).padStart(4, "0")}-${String(expectedMonth).padStart(2, "0")}-${String(expectedDay).padStart(2, "0")}T16:43:23.756Z`);
                                    t.deepEqual(value, expected, `TIMESTAMPADD(MONTH, ${deltaMonth}, ${year}-${String(month).padStart(2, "0")}-${String(curDay).padStart(2, "0")} 16:43:23.756) = ${expected.toISOString()}`);
                                })
                                .catch((err) => {
                                    t.fail(`TIMESTAMPADD(MONTH, ${deltaMonth}, ${year}-${String(month).padStart(2, "0")}-${String(curDay).padStart(2, "0")} 16:43:23.756)`);
                                    t.fail([expectedYear, expectedMonth, expectedDay].join(", "));
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
