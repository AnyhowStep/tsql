import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.rPad("1234", BigInt(5), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "12349", `RPAD('1234', 5, '9') = '12349'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("1234", BigInt(6), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "123499", `RPAD('1234', 6, '9') = '123499'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("1234", BigInt(7), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "1234999", `RPAD('1234', 7, '9') = '1234999'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("1234", BigInt(8), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "12349999", `RPAD('1234', 8, '9') = '12349999'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
