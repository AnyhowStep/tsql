import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntUnsigned(),
                myTableVal : tm.mysql.bigIntUnsigned().orNull(),
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
                                    columnAlias : "myTableId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "myTableVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                            ],
                        },
                    ]
                }
            );

            await myTable
                .insertMany(
                    connection,
                    [
                        {
                            myTableId : BigInt(1),
                            myTableVal : BigInt(1),
                        },
                        {
                            myTableId : BigInt(2),
                            myTableVal : BigInt(2),
                        },
                        {
                            myTableId : BigInt(3),
                            myTableVal : null,
                        },
                    ]
                );

            await tsql.from(myTable)
                .selectValue(columns => tsql.ifIsNull(
                    columns.myTableVal,
                    BigInt(9001),
                    ({myTableVal}) => tsql.integer.add(
                        myTableVal,
                        BigInt(100)
                    )
                ))
                .orderBy(columns => [
                    columns.myTable.myTableId.asc(),
                ])
                .fetchValueArray(connection)
                .then((arr) => {
                    t.deepEqual(
                        arr,
                        [BigInt(101), BigInt(102), BigInt(9001)]
                    );
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
