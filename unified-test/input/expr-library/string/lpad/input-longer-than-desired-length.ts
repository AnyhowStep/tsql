import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(3), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "123", `LPAD('1234', 3, '9') = '123'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(2), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "12", `LPAD('1234', 2, '9') = '12'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(1), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "1", `LPAD('1234', 1, '9') = '1'`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.lPad("1234", BigInt(0), "9"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "", `LPAD('1234', 0, '9') = ''`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
