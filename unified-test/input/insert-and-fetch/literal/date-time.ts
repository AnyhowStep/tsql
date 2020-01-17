import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const myTable = tsql.table("myTable")
                .addColumns({
                    value : tsql.dtDateTime(3),
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
                                        typeHint : tsql.TypeHint.DATE_TIME,
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
                        value : new Date("2020-01-11T01:56:37.761Z"),
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : new Date("2020-01-11T01:56:37.761Z") });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : new Date(0),
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : new Date(0) });
                });

        });

        t.end();
    });
};
