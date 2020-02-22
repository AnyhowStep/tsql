import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                `{}`,
                //`{"x": "y"}`,
                //`{"123": 456}`,
                //`{"arr": [1, 2, 3]}`,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.unsafeCastAsJson(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, a);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
