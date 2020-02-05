import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(5), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "91234", `LPAD('1234', 5, '9') = '91234'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(6), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "991234", `LPAD('1234', 6, '9') = '991234'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(7), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "9991234", `LPAD('1234', 7, '9') = '9991234'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(8), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "99991234", `LPAD('1234', 8, '9') = '99991234'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
