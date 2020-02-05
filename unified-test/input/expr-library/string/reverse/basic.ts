import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                "1 234 ",
                "\t 1234 \t ",
                "\n 1234 \n ",
                "1 234  ",
                "\t 1234 \t  ",
                "\n 1234 \n  ",
                "",
                "abc",
            ];
            for (const str of arr) {
                await tsql
                    .selectValue(() => tsql.reverse(str))
                    .fetchValue(connection)
                    .then((value) => {
                        const expected = [...str].reverse().join("");
                        t.deepEqual(value, expected, `REVERSE(${JSON.stringify(str)}) = ${JSON.stringify(expected)}`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
