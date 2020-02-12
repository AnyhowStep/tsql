import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let second=0; second<=59; ++second) {
                const secondStr = String(second).padStart(2, "0");
                const dateStr = `3001-09-14 23:59:${secondStr}`;

                await tsql
                    .selectValue(() => tsql.extractIntegerSecond(tsql.throwIfNull(tsql.utcStringToTimestamp(dateStr))))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, BigInt(second));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
