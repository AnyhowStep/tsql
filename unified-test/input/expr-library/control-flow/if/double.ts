import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.if(true, 6.282, 9001))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 6.282);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.if(false, 6.282, 9001))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 9001);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.if(true, null as null|number, 9001))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.if(false, null as null|number, 9001))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 9001);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.if(true, -42, null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, -42);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.if(false, -42, null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.if(true, null, null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.if(false, null, null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
