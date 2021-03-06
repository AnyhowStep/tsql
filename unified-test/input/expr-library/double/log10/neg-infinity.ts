import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.double.log10(-Infinity))
                .fetchValue(connection)
                .then((value) => {
                    const expected = null;
                    t.deepEqual(
                        value,
                        expected,
                        `LOG10(${-Infinity}) ~= ${expected} ~/= ${value}`
                    );
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
        });

        t.end();
    });
};
