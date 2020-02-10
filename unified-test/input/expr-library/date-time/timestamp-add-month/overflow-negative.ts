import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.timestampAddMonth(
                    BigInt(-8000*12),
                    tsql.utcStringToTimestamp(`2018-02-03 16:43:23.756`)
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
