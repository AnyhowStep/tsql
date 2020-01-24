import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        const resultSet = await pool.acquire((connection) => {
            return tsql.selectValue(() => 42)
                .fetchAllUnmapped(
                    connection
                );
        });
        t.deepEqual(
            resultSet,
            [
                {
                    $aliased : {
                        value : 42,
                    }
                }
            ]
        );

        t.end();
    });
};
