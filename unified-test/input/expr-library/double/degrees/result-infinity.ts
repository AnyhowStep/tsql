import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const a = 1e308;
            await tsql.selectValue(() => tsql.double.degrees(a))
                .fetchValue(connection)
                .then((value) => {
                    const expected = Infinity;
                    t.deepEqual(
                        value,
                        expected,
                        `DEGREES(${a}) ~= ${expected} ~/= ${value}`
                    );
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
        });

        t.end();
    });
};
