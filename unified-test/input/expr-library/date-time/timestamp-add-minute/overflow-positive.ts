import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.timestampAddMinute(
                    BigInt(1),
                    tsql.throwIfNull(tsql.utcStringToTimestamp(`9999-12-31 23:59:23.756`))
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError, String(err));
                });
        });

        t.end();
    });
};
