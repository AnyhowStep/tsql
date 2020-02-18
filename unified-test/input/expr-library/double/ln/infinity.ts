import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.double.ln(Infinity))
                .fetchValue(connection)
                .then((value) => {
                    const expected = Infinity;
                    t.deepEqual(
                        value,
                        expected,
                        `LN(${Infinity}) ~= ${expected} ~/= ${value}`
                    );
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
        });

        t.end();
    });
};
