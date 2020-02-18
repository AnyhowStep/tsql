import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => 0)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 0);
                });

            await tsql.selectValue(() => -3.141)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, -3.141);
                });

            /**
             * @todo Add this test
             *
             * https://github.com/kripken/sql.js/issues/325
             *
             * https://github.com/kripken/sql.js/issues/295
             */
            /*
            await tsql.selectValue(() => Number.MAX_SAFE_INTEGER)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, Number.MAX_SAFE_INTEGER);
                });
            */
            await tsql.selectValue(() => 9007199254740990)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 9007199254740990);
                });

            /**
             * @todo Add this test
             *
             * https://github.com/kripken/sql.js/issues/325
             *
             * https://github.com/kripken/sql.js/issues/295
             */
            /*
            await tsql.selectValue(() => Number.MAX_VALUE)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, Number.MAX_VALUE);
                });
            */
            await tsql.selectValue(() => 1.234567e98)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 1.234567e98);
                });

            await tsql.selectValue(() => NaN)
                .fetchValue(connection)
                .then((value) => {
                    t.fail(`Expected to throw; received ${value}`);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
            await tsql.selectValue(() => Infinity)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, Infinity);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
            await tsql.selectValue(() => -Infinity)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, -Infinity);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });

            //Almost 1, Used by `double.random()` impl
            await tsql.selectValue(() => 0.999999999999999)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 0.999999999999999);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
