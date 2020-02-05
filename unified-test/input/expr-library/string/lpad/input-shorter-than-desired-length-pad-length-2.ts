import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(5), "98"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "91234", `LPAD('1234', 5, '98') = '91234'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(6), "98"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "981234", `LPAD('1234', 6, '98') = '981234'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(7), "98"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "9891234", `LPAD('1234', 7, '98') = '9891234'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(8), "98"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "98981234", `LPAD('1234', 8, '98') = '98981234'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
