import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const myTable = tsql.table("myTable")
                .addColumns({
                    value : tsql.dtDouble(),
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
                                        typeHint : tsql.TypeHint.DOUBLE,
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
                        value : 0,
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : 0 });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : -3.141,
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : -3.141 });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : 9007199254740990,
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : 9007199254740990 });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : 1.234567e98,
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : 1.234567e98 });
                });

        });

        t.end();
    });
};
