import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql
                .selectValue(() => tsql.nullSafeEq(
                    "hello",
                    tsql.selectValue(() => "hello")
                        .unionDistinct(
                            tsql.selectValue(() => "hello")
                        )
                        .compoundQueryLimit(1)
                        .throwIfNull()
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });
            await tsql
                .selectValue(() => tsql.nullSafeEq(
                    null,
                    tsql.selectValue(() => null)
                        .unionDistinct(
                            tsql.selectValue(() => null)
                        )
                        .compoundQueryLimit(1)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });
            await tsql
                .selectValue(() => tsql.nullSafeEq(
                    "hello",
                    tsql.selectValue(() => null)
                        .unionDistinct(
                            tsql.selectValue(() => null)
                        )
                        .compoundQueryLimit(1)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });
            await tsql
                .selectValue(() => tsql.nullSafeEq(
                    null as null|string,
                    tsql.selectValue(() => "hello")
                        .unionDistinct(
                            tsql.selectValue(() => "hello")
                        )
                        .compoundQueryLimit(1)
                        .throwIfNull()
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });
            await tsql
                .selectValue(() => tsql.nullSafeEq(
                    "hello",
                    tsql.selectValue(() => "hello2")
                        .unionDistinct(
                            tsql.selectValue(() => "hello2")
                        )
                        .compoundQueryLimit(1)
                        .throwIfNull()
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });
        });

        t.end();
    });
};
