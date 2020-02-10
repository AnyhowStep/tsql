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
            for(const month of arr) {
                await tsql
                    .selectValue(() => tsql.timestampAddMonth(
                        BigInt(month),
                        tsql.utcStringToTimestamp(`2018-02-03 16:43:23.756`)
                    ))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = new Date(`2018-02-03T16:43:23.756Z`);
                        expected.setUTCMonth(expected.getUTCMonth() + month);
                        t.deepEqual(value, expected);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
