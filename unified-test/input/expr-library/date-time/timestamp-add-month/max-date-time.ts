import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.timestampAddMonth(
                    BigInt(2),
                    tsql.throwIfNull(tsql.utcStringToTimestamp(`9999-10-31 23:59:59.999`))
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, new Date("9999-12-31T23:59:59.999Z"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
