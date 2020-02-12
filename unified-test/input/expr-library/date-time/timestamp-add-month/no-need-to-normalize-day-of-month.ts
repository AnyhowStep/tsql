import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {mysqlAddMonths} from "./mysql-add-months";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                99,
                100,
                101,
                999,
                1000,
                2000,
                2018,
            ];
            for(const month of arr) {
                await tsql
                    .selectValue(() => tsql.timestampAddMonth(
                        BigInt(month),
                        tsql.throwIfNull(tsql.utcStringToTimestamp(`2018-02-03 16:43:23.756`))
                    ))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = new Date(`2018-02-03T16:43:23.756Z`);
                        expected.setUTCMonth(expected.getUTCMonth() + month);
                        t.deepEqual(value, expected);
                    })
                    .catch((err) => {
                        console.log(mysqlAddMonths(2018, 2, 3, month));
                        t.fail(`month=${month}`);
                        t.fail(String(err));
                    });
            }
            for(const month of arr) {
                await tsql
                    .selectValue(() => tsql.timestampAddMonth(
                        BigInt(-month),
                        tsql.throwIfNull(tsql.utcStringToTimestamp(`2018-02-03 16:43:23.756`))
                    ))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = new Date(`2018-02-03T16:43:23.756Z`);
                        expected.setUTCMonth(expected.getUTCMonth() + -month);
                        t.deepEqual(value, expected);
                    })
                    .catch((err) => {
                        console.log(mysqlAddMonths(2018, 2, 3, -month));
                        t.fail(`month=${month}`);
                        t.fail(String(err));
                    });
            }
        });

        t.end();
    });
};
