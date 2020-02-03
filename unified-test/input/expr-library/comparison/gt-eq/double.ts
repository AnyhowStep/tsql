import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.gtEq(1, 2))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.gtEq(2, 2))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.gtEq(2.5, 2))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.pass(err.message);
                });
        });

        t.end();
    });
};
