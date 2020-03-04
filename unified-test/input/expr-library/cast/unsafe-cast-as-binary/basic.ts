import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                "abcd",
                "123",
                "123e0",
                "1.456",
                "hello, world",
                "case-SENSITIVE",
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.unsafeCastAsBinary(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, Buffer.from(a));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
