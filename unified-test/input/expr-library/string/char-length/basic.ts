import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            /**
             * No surrogate pairs here.
             * Results should be consistent across databases and character sets...
             * Right?
             */
            const arr = [
                "",
                "a",
                "ab",
                "abc",
                "abcd",
                "漢字",
                "💙💔",
            ] as const;

            for (const a of arr) {
                await tsql.selectValue(() => tsql.charLength(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, BigInt([...a].length), `CHAR_LENGTH(${a}) = ${[...a].length}`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
