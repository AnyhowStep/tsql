import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const year = 2016;
            const month = 2;
            const day = 29;
            const hour = 22;
            for (let minute=0; minute<=59; ++minute) {
                for (let deltaMinute=-500; deltaMinute<=500; ++deltaMinute) {
                    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:23.756`;
                    await tsql
                        .selectValue(() => tsql.timestampAddMinute(
                            BigInt(deltaMinute),
                            tsql.throwIfNull(tsql.utcStringToTimestamp(`${dateStr} ${timeStr}`))
                        ))
                        .fetchValue(connection)
                        .then((value) => {
                            const startDateTime = new Date(`${dateStr}T${timeStr}Z`);
                            const startTimestamp = startDateTime.getTime();
                            const expected = new Date(startTimestamp + (deltaMinute * 60 * 1000));
                            t.deepEqual(value, expected, `TIMESTAMPADD(MINUTE, ${deltaMinute}, '${dateStr} ${timeStr}') = ${expected.toISOString()}`);
                        })
                        .catch((err) => {
                            t.fail(String(err));
                        });
                }
            }
        });

        t.end();
    });
};
