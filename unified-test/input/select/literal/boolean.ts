import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => true)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                });

            await tsql.selectValue(() => false)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                });
        });

        t.end();
    });
};
