import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.integer.neg(BigInt("-9223372036854775808")))
                .fetchValue(connection)
                .then(() => {
                    t.fail(`-(-9223372036854775808) should overflow and throw`);
                })
                .catch((err) => {
                    /**
                     * MySQL implicitly casts to `DECIMAL`, and doesn't throw an error.
                     * SQLite implicitly casts to `DOUBLE`, and doesn't throw an error.
                     * PostgreSQL implicitly casts to `DECIMAL` and doesn't throw an error.
                     *
                     * The polyfill for SQLite should throw.
                     */
                    t.true(err instanceof Error);
                });
        });

        t.end();
    });
};
