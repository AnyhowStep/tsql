import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            /**
             * We only check lowercase letters here.
             * Different databases have different `LIKE` behaviours,
             * depending on the default collation.
             *
             * MySQL and SQLite are probably case-insensitive.
             * PostgreSQL is probably case-sensitive.
             */
            const arr = [
                "abc",
                "aaa",
                "cba",
                "bbb",
            ];
            for (const a of arr) {
                for (const  b of arr) {
                    await tsql.selectValue(() => tsql.notLike(a, b, "\\"))
                        .fetchValue(connection)
                        .then((value) => {
                            t.deepEqual(value, a !== b);
                        })
                        .catch((err) => {
                            t.fail(err.message);
                        });
                }
            }
        });

        t.end();
    });
};
