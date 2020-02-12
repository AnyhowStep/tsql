import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const from = new Date("1000-01-01T00:00:00.000Z");
            const to = new Date("9999-12-31T23:59:59.999Z");
            await tsql
                .selectValue(() => tsql.timestampDiffMillisecond(
                    from,
                    to
                ))
                .fetchValue(connection)
                .then((value) => {
                    const expected = to.getTime()-from.getTime();
                    t.deepEqual(value, BigInt(expected), `TIMESTAMPDIFF(MILLISECOND, ${from.toISOString()}, ${to.toISOString()}) = ${expected}`);
                })
                .catch((err) => {
                    t.fail(String(err));
                });
        });

        t.end();
    });
};
