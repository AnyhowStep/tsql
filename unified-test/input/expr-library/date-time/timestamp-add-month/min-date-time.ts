import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.timestampAddMonth(
                    BigInt(-1),
                    tsql.throwIfNull(tsql.utcStringToTimestamp(`0000-02-01 00:00:00.000`))
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, new Date("0000-01-01T00:00:00.000Z"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
