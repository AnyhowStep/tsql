import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.currentSchema())
                .fetchValue(connection)
                .then((value) => {
                    /**
                     * Can't really test for anything much here.
                     * Different databases have different default databases.
                     */
                    t.true(value === null || typeof value === "string");
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });
        });

        t.end();
    });
};
