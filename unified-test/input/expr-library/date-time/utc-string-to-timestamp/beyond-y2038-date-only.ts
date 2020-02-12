import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.utcStringToTimestamp("2040-05-23"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, new Date("2040-05-23T00:00:00.000Z"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
