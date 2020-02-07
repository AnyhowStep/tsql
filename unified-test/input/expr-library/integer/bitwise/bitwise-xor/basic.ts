import * as tm from "type-mapping";
import {Test} from "../../../../../test";
import * as tsql from "../../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                0,
                1,
                2,
                3,
                4,
                -1,
                -2,
                -3,
                -4,
                1234,
                -5678,
                74923600,
                -9104758200,
                "9223372036854775807",
                "-9223372036854775808",
            ];
            for (const a of arr) {
                for (const b of arr) {
                    const expected = tm.BigIntUtil.bitwiseXor(BigInt(a), BigInt(b));
                    await tsql
                        .selectValue(() => tsql.integer.bitwiseXor(
                            BigInt(a),
                            BigInt(b)
                        ))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, expected, `(${a} ^ ${b}) = ${expected}`);
                        })
                        .catch((err) => {
                            t.fail(`(${a} ^ ${b}) = ${expected}`);
                            t.fail(err.message);
                        });
                }
            }

        });

        t.end();
    });
};
