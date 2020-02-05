import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.rPad("1234", BigInt(4), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "1234", `RPAD('1234', 4, '9') = '1234'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("123", BigInt(3), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "123", `RPAD('123', 3, '9') = '123'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("12", BigInt(2), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "12", `RPAD('12', 2, '9') = '12'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("1", BigInt(1), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "1", `RPAD('1', 1, '9') = '1'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.rPad("", BigInt(0), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "", `RPAD('', 0, '9') = ''`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
