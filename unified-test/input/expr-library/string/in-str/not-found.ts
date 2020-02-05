import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.inStr("abc", "xy"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(0), `INSTR("abc", "xy") = 0`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql
                .selectValue(() => tsql.inStr("", "xy"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(0), `INSTR("", "xy") = 0`);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
