import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.double.mul(-1e308, 1e308))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, -Infinity);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
            await tsql.selectValue(() => tsql.double.mul(1e308, -1e308))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, -Infinity);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
        });

        t.end();
    });
};
