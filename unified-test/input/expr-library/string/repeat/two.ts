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
                    .selectValue(() => tsql.repeat(str, BigInt(2)))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, str+str, `REPEAT(${JSON.stringify(str)}, 2) = ${JSON.stringify(str+str)}`);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
