import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let fractionalSecond=0; fractionalSecond<=999; ++fractionalSecond) {
                const fractionalSecondStr = String(fractionalSecond).padStart(3, "0");
                const dateStr = `3001-09-14 23:59:59.${fractionalSecondStr}`;

                await tsql
                    .selectValue(() => tsql.extractFractionalSecond3(tsql.throwIfNull(tsql.utcStringToTimestamp(dateStr))))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, 59 + fractionalSecond/1000);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
