import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.inStr("abc", "a"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(1), `INSTR("abc", "a") = 1`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.inStr("abc", "ab"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(1), `INSTR("abc", "ab") = 1`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.inStr("abc", "abc"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(1), `INSTR("abc", "abc") = 1`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.inStr("", ""))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(1), `INSTR("", "") = 1`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.inStr("abc", "b"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(2), `INSTR("abc", "b") = 2`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.inStr("abc", "bc"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(2), `INSTR("abc", "bc") = 2`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.inStr("abc", "c"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(3), `INSTR("abc", "c") = 3`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
