import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.nullIf(6.282, 9001))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 6.282);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullIf(9001, 6.282))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 9001);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullIf(null as null|number, 9001))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullIf(9001, null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 9001);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullIf(-42, null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, -42);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullIf(null as null|number, -42))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullIf(null, null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, null);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.nullIf(null, null))
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
