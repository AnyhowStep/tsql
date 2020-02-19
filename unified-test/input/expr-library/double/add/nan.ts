import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.double.add(1e999, -1e999))
                .fetchValue(connection)
                .then((value) => {
                    t.fail(`${value}`);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
            await tsql.selectValue(() => tsql.double.add(-1e999, 1e999))
                .fetchValue(connection)
                .then((value) => {
                    t.fail(`${value}`);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });
        });

        t.end();
    });
};
