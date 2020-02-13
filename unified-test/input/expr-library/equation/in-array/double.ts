import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.inArray(1, []))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.inArray(1, [1]))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.inArray(1, [2]))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.inArray(1, [5, 1]))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.inArray(1, [5, 8]))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.inArray(1, [7, 1, 4]))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.inArray(1, [7, 9, 4]))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
