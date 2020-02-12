import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const year = 2016;
            const month = 2;
            const day = 29;
            const hour = 22;
            const minute = 58;
            for (let second=0; second<=59; ++second) {
                for (let deltaSecond=-500; deltaSecond<=500; ++deltaSecond) {
                    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}.756`;
                    await tsql
                        .selectValue(() => tsql.timestampAddSecond(
                            BigInt(deltaSecond),
                            tsql.throwIfNull(tsql.utcStringToTimestamp(`${dateStr} ${timeStr}`))
                        ))
                        .fetchValue(connection)
                        .then((value) => {
                            const startDateTime = new Date(`${dateStr}T${timeStr}Z`);
                            const startTimestamp = startDateTime.getTime();
                            const expected = new Date(startTimestamp + (deltaSecond * 1000));
                            t.deepEqual(value, expected, `TIMESTAMPADD(SECOND, ${deltaSecond}, '${dateStr} ${timeStr}') = ${expected.toISOString()}`);
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
