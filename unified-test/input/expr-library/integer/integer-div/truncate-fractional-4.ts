import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("9223372036854775807"),
                    BigInt(4)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("2305843009213693951"));
                });

            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("-9223372036854775807"),
                    BigInt(4)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-2305843009213693951"));
                });

            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("9223372036854775807"),
                    BigInt(-4)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-2305843009213693951"));
                });

            await tsql
                .selectValue(() => tsql.integer.integerDiv(
                    BigInt("-9223372036854775807"),
                    BigInt(-4)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("2305843009213693951"));
                });

        });

        t.end();
    });
};
