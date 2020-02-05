import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                " 1 234",
                " \t 1234 \t",
                " \n 1234 \n",
                "  1 234",
                "  \t 1234 \t",
                "  \n 1234 \n",
            ];
            for (const str of arr) {
                await tsql
                    .selectValue(() => tsql.repeat(str, BigInt(-1)))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, "", `REPEAT(${JSON.stringify(str)}, -1) = ""`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
