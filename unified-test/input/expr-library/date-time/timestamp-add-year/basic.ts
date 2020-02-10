import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                0,
                1,
                2,
                99,
                100,
                101,
                999,
                1000,
                2000,
                2018,
            ];
            for (const year of arr) {
                await tsql
                    .selectValue(() => tsql.timestampAddYear(
                        BigInt(year),
                        tsql.utcStringToTimestamp(`2018-02-03 16:43:23.756`)
                    ))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, new Date(`${2018+year}-02-03T16:43:23.756Z`));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
            for (const year of arr) {
                await tsql
                    .selectValue(() => tsql.timestampAddYear(
                        BigInt(-year),
                        tsql.utcStringToTimestamp(`2018-02-03 16:43:23.756`)
                    ))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = `${String(2018-year).padStart(4, "0")}-02-03T16:43:23.756Z`;
                        t.deepEqual(value, new Date(expected), `TIMESTAMPADD(YEAR, ${-year}, 2018-02-03 16:43:23.756) = ${expected}`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
