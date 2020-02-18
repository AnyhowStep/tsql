import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.double.atan(Infinity))
                .fetchValue(connection)
                .then((value) => {
                    const expected = Math.atan(Infinity);
                    const margin = 0.000000000000001;

                    t.true(
                        Math.abs(value - expected) <= margin,
                        `ATAN(${Infinity}) ~= ${expected} ~/= ${value}`
                    );
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
        });

        t.end();
    });
};
