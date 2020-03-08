import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.integer.integerRemainder(
                    BigInt("9223372036854775807"),
                    BigInt("-9223372036854775808")
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("9223372036854775807"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.integer.integerRemainder(
                    BigInt("-9223372036854775807"),
                    BigInt("-9223372036854775808")
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-9223372036854775807"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

        });

        t.end();
    });
};
