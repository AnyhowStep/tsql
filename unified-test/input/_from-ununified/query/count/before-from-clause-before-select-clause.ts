import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        const resultSet = await pool.acquire((connection) => {
            return tsql.QueryUtil.newInstance()
                .count(
                    connection
                );
        });
        t.deepEqual(
            resultSet,
            BigInt(1)
        );

        t.end();
    });
};
