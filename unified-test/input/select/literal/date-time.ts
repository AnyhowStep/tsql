import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => new Date("2020-01-11T01:56:37.761Z"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, new Date("2020-01-11T01:56:37.761Z"));
                });

            await tsql.selectValue(() => new Date(0))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, new Date(0));
                });
        });

        t.end();
    });
};
