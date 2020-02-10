import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {mysqlAddMonths} from "./mysql-add-months";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const month = 1;
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
                    console.log(err.actualValue);
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
