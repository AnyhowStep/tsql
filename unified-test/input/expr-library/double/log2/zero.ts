import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.double.log2(0))
                .fetchValue(connection)
                .then((value) => {
                    const expected = null;
                    t.deepEqual(
                        value,
                        expected,
                        `LOG2(${0}) ~= ${expected} ~/= ${value}`
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
