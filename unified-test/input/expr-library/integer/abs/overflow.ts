import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.integer.abs(BigInt("-9223372036854775808")))
                .fetchValue(connection)
                .then(() => {
                    t.fail(`ABS(-9223372036854775808) should overflow and throw`);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
        });

        t.end();
    });
};
