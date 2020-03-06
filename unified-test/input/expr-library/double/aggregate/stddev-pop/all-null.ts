import * as tm from "type-mapping";
import {Test} from "../../../../../test";
import * as tsql from "../../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableVal : tm.mysql.double().orNull(),
            });

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "myTableVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.DOUBLE,
                                    },
                                    nullable : true,
                                },
                            ],
                        },
                    ]
                }
            );

            for (let i=0; i<10; ++i) {
                await myTable
                    .where(() => true)
                    .fetchValue(
                        connection,
                        columns => tsql.double.stdDevPop(columns.myTableVal)
                    )
                    .then((value) => {
                        t.deepEqual(value, null);
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
                await myTable.insertOne(
                    connection,
                    {
                        myTableVal : null,
                    }
                );
            }
        });

        t.end();
    });
};
