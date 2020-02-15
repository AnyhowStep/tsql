import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned().orNull(),
                myTableVal : tm.mysql.bigIntSigned(),
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
                                    nullable : true,
                                },
                                {
                                    columnAlias : "myTableVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        },
                    ]
                }
            );

            await myTable.insertMany(
                connection,
                [
                    {
                        myTableId : BigInt(2),
                        myTableVal : BigInt(200),
                    },
                    {
                        myTableId : BigInt(2),
                        myTableVal : BigInt(200),
                    },
                    {
                        myTableId : BigInt(3),
                        myTableVal : BigInt(300),
                    },
                    {
                        myTableId : BigInt(3),
                        myTableVal : BigInt(300),
                    },
                    {
                        myTableId : BigInt(3),
                        myTableVal : BigInt(300),
                    },
                    {
                        myTableId : null,
                        myTableVal : BigInt(999),
                    },
                    {
                        myTableId : null,
                        myTableVal : BigInt(998),
                    },
                    {
                        myTableId : null,
                        myTableVal : BigInt(997),
                    },
                ]
            );
            await tsql.from(myTable)
                .where(columns => tsql.nullSafeEq(
                    columns.myTableId,
                    null
                ))
                .orderBy(columns => [
                    columns.myTableVal.asc(),
                ])
                .select(columns => [columns])
                .fetchAll(connection)
                .then((rows) => {
                    t.deepEqual(
                        rows,
                        [
                            {
                                myTableId : null,
                                myTableVal : BigInt(997),
                            },
                            {
                                myTableId : null,
                                myTableVal : BigInt(998),
                            },
                            {
                                myTableId : null,
                                myTableVal : BigInt(999),
                            },
                        ]
                    );
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
