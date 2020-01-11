import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.decimalLiteral(1.23, 3, 2))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value.toString(), "1.23");
                });

            await tsql.selectValue(() => tsql.decimalLiteral("1234567890123456789012345678901234567890", 40, 0))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value.toString(), "1234567890123456789012345678901234567890.0");
                });

            await tsql.selectValue(() => tsql.decimalLiteral("1234567890123456789012345678901234567890.888", 43, 3))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value.toString(), "1234567890123456789012345678901234567890.888");
                });

            await tsql.selectValue(() => tsql.decimalLiteral("1234567890123.456789012345678901234567890888", 43, 30))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value.toString(), "1234567890123.456789012345678901234567890888");
                });

            await tsql.selectValue(() => tsql.decimalLiteral("-1234567890123456789012345678901234567890", 40, 0))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value.toString(), "-1234567890123456789012345678901234567890.0");
                });

            await tsql.selectValue(() => tsql.decimalLiteral("-1234567890123456789012345678901234567890.888", 43, 3))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value.toString(), "-1234567890123456789012345678901234567890.888");
                });

            await tsql.selectValue(() => tsql.decimalLiteral("-1234567890123.456789012345678901234567890888", 43, 30))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value.toString(), "-1234567890123.456789012345678901234567890888");
                });

            /**
             * Scale must be <= 30, because of MySQL
             */
            t.throws(() => {
                tsql.selectValue(() => tsql.decimalLiteral("1234567890123.456789012345678901234567890888", 43, 31));
            });


            /**
             * Precision must be <= 65, because of MySQL
             */
            t.throws(() => {
                tsql.selectValue(() => tsql.decimalLiteral("1234567890123.456789012345678901234567890888", 66, 30));
            });
        });

        t.end();
    });
};
