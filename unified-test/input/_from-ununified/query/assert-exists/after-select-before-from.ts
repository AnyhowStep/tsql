import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => 42)
                .assertExists(
                    connection
                )
                .then(() => {
                    t.pass();
                })
                .catch(() => {
                    t.fail("Should exist");
                });
        });

        t.end();
    });
};
