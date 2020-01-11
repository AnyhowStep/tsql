import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            /**
             * MIN BIGINT SIGNED VALUE * 2
             *
             * This should throw an error
             */
            await tsql.selectValue(() => tsql.integer.mul(BigInt("-9223372036854775808"), BigInt(2)))
                .fetchValue(connection)
                .then(() => {
                    t.fail(`-9223372036854775808 * 2 should overflow and throw`);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });

            /**
             * MIN BIGINT SIGNED VALUE * -1
             *
             * This should throw an error
             */
            await tsql.selectValue(() => tsql.integer.mul(BigInt("-9223372036854775808"), BigInt(-1)))
                .fetchValue(connection)
                .then(() => {
                    t.fail(`-9223372036854775808 * -1 should overflow and throw`);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });

            /**
             * (MIN BIGINT SIGNED VALUE + 1) * -1
             */
            await tsql
                .selectValue(() => tsql.integer.mul(
                    tsql.integer.add(
                        BigInt("-9223372036854775808"),
                        BigInt(1)
                    ),
                    BigInt(-1))
                )
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("9223372036854775807"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            /**
             * (MIN BIGINT SIGNED VALUE / 2) * 2
             */
            await tsql
                .selectValue(() => tsql.integer.mul(
                    BigInt("-4611686018427387904"),
                    BigInt(2))
                )
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-9223372036854775808"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            /**
             * MAX BIGINT SIGNED VALUE * 2
             *
             * This should throw an error
             */
            await tsql.selectValue(() => tsql.integer.mul(BigInt("9223372036854775807"), BigInt(2)))
                .fetchValue(connection)
                .then(() => {
                    t.fail(`9223372036854775807 + 1 should overflow and throw`);
                })
                .catch((err) => {
                    t.true(err instanceof tsql.DataOutOfRangeError);
                });

            /**
             * MAX BIGINT SIGNED VALUE * -1
             */
            await tsql.selectValue(() => tsql.integer.mul(BigInt("9223372036854775807"), BigInt(-1)))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("-9223372036854775807"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

            /**
             * (MAX BIGINT SIGNED VALUE / 2) * 2
             */
            await tsql
                .selectValue(() => tsql.integer.mul(
                    BigInt("4611686018427387903"),
                    BigInt(2))
                )
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt("9223372036854775806"));
                })
                .catch((err) => {
                    t.fail(err.message);
                });

        });

        t.end();
    });
};
