import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => BigInt(9001))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, BigInt(9001));
                });
        });

        t.end();
    });
};
