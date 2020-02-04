import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.concatWs("~", null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.concatWs("~", "a"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "a");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.concatWs("~", null, ""))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.concatWs("~", "", null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.concatWs("~", null, null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.concatWs("~", null, "a"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "a");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.concatWs("~", "a", null))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "a");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.concatWs("~", "a", null, "b"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "a~b");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.concatWs("~", "a", null, "b", null, "c"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "a~b~c");
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
