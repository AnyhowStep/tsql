import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.rPad("1234", BigInt(5), "98"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "12349", `RPAD('1234', 5, '98') = '12349'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("1234", BigInt(6), "98"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "123498", `RPAD('1234', 6, '98') = '123498'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("1234", BigInt(7), "98"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "1234989", `RPAD('1234', 7, '98') = '1234989'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("1234", BigInt(8), "98"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "12349898", `RPAD('1234', 8, '98') = '12349898'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
