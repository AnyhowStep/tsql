import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.double.fractionalDiv(1e308, -0.1))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(
                        value,
                        -Infinity,
                        `(1e308/-0.1) ~= ${-Infinity} ~/= ${value}`
                    );
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
        });

        t.end();
    });
};
