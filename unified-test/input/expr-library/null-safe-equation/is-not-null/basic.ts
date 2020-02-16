import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const arr = [
                1,
                BigInt(32),
                "test",
                new Uint8Array([9,5,6]),
                new Date(),
                true,
                false,
                null,
            ];
            for (const a of arr) {
                await tsql.selectValue(() => tsql.isNotNull(a))
                    .fetchValue(connection)
                    .then((value) => {
                        t.deepEqual(value, a !== null);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
