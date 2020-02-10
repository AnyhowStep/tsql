import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let month=1; month<=12; ++month) {
                const monthStr = String(month).padStart(2, "0");
                const dateStr = `0002-${monthStr}-01`;

                await tsql
                    .selectValue(() => tsql.extractMonth(tsql.utcStringToTimestamp(dateStr)))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, BigInt(month));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
