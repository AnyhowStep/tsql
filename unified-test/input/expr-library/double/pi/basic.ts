import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            await tsql.selectValue(() => tsql.double.pi())
                .fetchValue(connection)
                .then((value) => {
                    /**
                     * @todo PostgreSQL might have a different value
                     */
                    t.deepEqual(value, Math.PI);
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
