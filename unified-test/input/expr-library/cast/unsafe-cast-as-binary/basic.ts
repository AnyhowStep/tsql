import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                "abc",
                "hello",
                "ABC",
                "qwerty123",
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.unsafeCastAsBinary(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, Buffer.from(a.split("").map(char => char.charCodeAt(0))));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
