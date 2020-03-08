import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        /**
         * Dividing by zero should either return `null`,
         * or throw a `DivideByZeroError`.
         *
         * Either is "acceptable", unfortunately.
         * + MySQL will return `null`.
         * + PostgreSQL will throw.
         * + SQLite will return `null`.
         */
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("-9223372036854775808"),
                    BigInt(0)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DivideByZeroError);
                });

            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("9223372036854775807"),
                    BigInt(0)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DivideByZeroError);
                });

            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt(0),
                    BigInt(0)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DivideByZeroError, err.message);
                });

        });

        t.end();
    });
};
