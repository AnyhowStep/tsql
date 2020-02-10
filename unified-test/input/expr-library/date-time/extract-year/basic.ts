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
                3000,
                9999,
            ];
            for(const year of arr) {
                const yearStr = String(year).padStart(4, "0");
                const dateStr = `${yearStr}-01-01`;

                await tsql
                    .selectValue(() => tsql.extractYear(tsql.utcStringToTimestamp(dateStr)))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, BigInt(year));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
