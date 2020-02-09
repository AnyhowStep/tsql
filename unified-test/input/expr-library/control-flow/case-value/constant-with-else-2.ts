import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql
                    .case(2)
                    .when(1, "one")
                    .when(2, "two")
                    .else("other")
                    .end()
                )
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "two");
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
