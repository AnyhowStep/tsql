import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let minute=0; minute<=59; ++minute) {
                const minuteStr = String(minute).padStart(2, "0");
                const dateStr = `3001-09-14 23:${minuteStr}:59`;

                await tsql
                    .selectValue(() => tsql.extractMinute(tsql.utcStringToTimestamp(dateStr)))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, BigInt(minute));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
