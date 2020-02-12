import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.utcStringToTimestamp("0003-05-23 14:42:55.829"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, new Date("0003-05-23T14:42:55.829Z"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
