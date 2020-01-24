import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            t.deepEqual(
                await tsql.selectValue(() => 42)
                    .exists(
                        connection
                    ),
                true
            );

        });

        t.end();
    });
};
