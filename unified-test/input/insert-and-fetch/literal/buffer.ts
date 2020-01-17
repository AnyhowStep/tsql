import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        await pool.acquire(async (connection) => {
            const myTable = tsql.table("myTable")
                .addColumns({
                    value : tsql.dtBlob(),
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
                                        typeHint : tsql.TypeHint.BUFFER,
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
                        value : Buffer.from("hello, world"),
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : Buffer.from("hello, world") });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : Buffer.from([1,2,3]),
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : Buffer.from([1,2,3]) });
                });

            await myTable
                .insertAndFetch(
                    connection,
                    {
                        value : new Uint8Array([4,5,6]),
                    }
                )
                .then((row) => {
                    t.deepEqual(row, { value : Buffer.from([4,5,6]) });
                });
        });

        t.end();
    });
};
