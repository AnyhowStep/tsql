import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                true,
                false,
                null,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.isUnknown(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, a === null);
                    })
                    .catch((err) => {
                        t.pass(err.message);
                    });
            }
        });

        t.end();
    });
};
