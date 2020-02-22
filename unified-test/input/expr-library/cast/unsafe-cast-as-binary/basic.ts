import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                "-123e0",
                "-1.456",
                "123e0",
                "1.456",
                tm.BigInt(876),
                tm.BigInt(-999),
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.unsafeCastAsDouble(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, Number(a));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
