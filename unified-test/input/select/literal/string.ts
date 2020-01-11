import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => "")
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "");
                });

            await tsql.selectValue(() => `"'\nhello\tworld\n\``)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, `"'\nhello\tworld\n\``);
                });
        });

        t.end();
    });
};
