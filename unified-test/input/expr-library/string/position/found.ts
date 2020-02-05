import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.position("a", "abc"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(1), `POSITION("a", "abc") = 1`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.position("ab", "abc"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(1), `POSITION("ab", "abc") = 1`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.position("abc", "abc"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(1), `POSITION("abc", "abc") = 1`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.position("", ""))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(1), `POSITION("", "") = 1`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.position("b", "abc"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(2), `POSITION("b", "abc") = 2`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.position("bc", "abc"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(2), `POSITION("bc", "abc") = 2`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.position("c", "abc"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(3), `POSITION("c", "abc") = 3`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
