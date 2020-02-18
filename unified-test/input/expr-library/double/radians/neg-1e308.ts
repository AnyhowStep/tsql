import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const a = -1e308;
            await tsql.selectValue(() => tsql.double.radians(a))
                .fetchValue(connection)
                .then((value) => {
                    const expected = -1.7453292519943295e+306;
                    /**
                     * We only allow such a wide margin here because of,
                     * https://github.com/kripken/sql.js/issues/325
                     */
                    const margin = 6.237000967296e+290;
                    t.true(
                        Math.abs(value - expected) <= margin,
                        `RADIANS(${a}) ~= ${expected} ~/= ${value}`
                    );
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
