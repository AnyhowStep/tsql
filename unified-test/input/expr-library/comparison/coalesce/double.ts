import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.coalesce())
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.coalesce(9001))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 9001);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.coalesce(null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.coalesce(1,2,3,4))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 1);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.coalesce(null,2,3,4))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 2);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.coalesce(null,null,3,4))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 3);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.coalesce(null,null,null,4))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 4);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.coalesce(null,null,null,null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.pass(err.message);
                });
        });

        t.end();
    });
};
