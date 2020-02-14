import {Test} from "../../test";
import * as tsql from "../../../dist";

export const test : Test = ({tape, pool}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const query = tsql
                .from(
                    tsql.selectValue(() => "hello")
                        .as("tmp")
                )
                .select(columns => [columns.value]);
            await query
                .fetchAll(connection)
                .then((rows) => {
                    t.deepEqual(
                        rows,
                        [
                            {
                                value : "hello",
                            }
                        ]
                    );
                })
                .catch((err) => {
                    console.error(err);
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
