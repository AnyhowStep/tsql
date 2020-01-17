import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const myTable = tsql.table("myTable")
                .addColumns({
                    value : tsql.dtVarChar(),
                })
                .setId(columns => columns.value);

            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "value",
                                    dataType : {
                                        typeHint : tsql.TypeHint.STRING,
                                    },
                                }
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "value",
                                autoIncrement : false,
                            } as const,
                        }
                    ]
                }
            );

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : "",
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : "" });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : `"'\nhello\tworld\n\``,
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : `"'\nhello\tworld\n\`` });
                });

        });

        t.end();
    });
};
