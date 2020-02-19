import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const base = 0;
            const x = 1;
            await tsql.selectValue(() => tsql.double.log(base, x))
                .fetchValue(connection)
                .then((value) => {
                    const expected = null;

                    t.deepEqual(
                        value,
                        expected,
                        `LOG(${base}, ${x}) ~= ${expected} ~/= ${value}`
                    );
                })
                .catch((err) => {
                    //@todo Cannot take logarithm of zero error
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
