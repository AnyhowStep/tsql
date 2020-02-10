import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            for (let hour=0; hour<=23; ++hour) {
                const hourStr = String(hour).padStart(2, "0");
                const dateStr = `3001-09-14 ${hourStr}:59:59`;

                await tsql
                    .selectValue(() => tsql.extractHour(tsql.utcStringToTimestamp(dateStr)))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, BigInt(hour));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
