import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.coalesce(null, null, 2))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 2);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
