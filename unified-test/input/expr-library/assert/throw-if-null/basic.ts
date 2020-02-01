import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.throwIfNull(null))
                .fetchValue(connection)
                .then(() => {
                    t.fail("Expected to throw");
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await tsql.selectValue(() => tsql.throwIfNull(BigInt("-9223372036854775808")))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-9223372036854775808"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.throwIfNull(3.141))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, 3.141);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.throwIfNull(tsql.decimalLiteral("123.123456789012345678901234567890", 60, 30)))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(String(value), "123.12345678901234567890123456789");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.throwIfNull(tsql.decimalLiteral("123.123456789012345678901234567891", 60, 30)))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(String(value), "123.123456789012345678901234567891");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.throwIfNull(true))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.throwIfNull(false))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.throwIfNull("hi"))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, "hi");
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            await tsql.selectValue(() => tsql.throwIfNull(new Uint8Array([8,7,6,5,4])))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, Buffer.from([8,7,6,5,4]));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            const now = new Date();
            await tsql.selectValue(() => tsql.throwIfNull(now))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, now);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
