import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntUnsigned(),
            });

        const myTableCopy = tsql.table("myTableCopy")
            .addColumns({
                myTableId : tm.mysql.bigIntUnsigned(),
            });

        const myTable2 = tsql.table("myTable2")
            .addColumns({
                myTable2Id : tm.mysql.bigIntUnsigned(),
            });

        const myTable3 = tsql.table("myTable3")
            .addColumns({
                myTable3Id : tm.mysql.bigIntUnsigned(),
            });


        const query = tsql.from(myTable)
            .crossJoin(
                tsql
                    .from(myTableCopy)
                    .select(c => [
                        c.myTableId,
                        tsql.isNotNull(c.myTableId).as("isNotNull")
                    ])
                    .crossJoin(myTable2)
                    .select(c => [
                        c.myTable2
                    ])
                    .crossJoin(myTable3)
                    .select(c => [
                        {
                            myTable3 : c.myTable3,
                        }
                    ])
                    .as("myAlias")
            )
            .where(c => tsql.and(
                tsql.gt(
                    c.myAlias.myTable2Id,
                    c.myTable.myTableId
                ),
                c.myAlias.isNotNull
            ))
            .select(c => [
                c
            ]);

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
                            ],
                        },
                        {
                            tableAlias : "myTableCopy",
                            columns : [
                                {
                                    columnAlias : "myTableId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        },
                        {
                            tableAlias : "myTable2",
                            columns : [
                                {
                                    columnAlias : "myTable2Id",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        },
                        {
                            tableAlias : "myTable3",
                            columns : [
                                {
                                    columnAlias : "myTable3Id",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        },
                    ]
                }
            );

            await myTable
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            myTableId : BigInt(1),
                        },
                        {
                            myTableId : BigInt(2),
                        },
                    ]
                );
            await myTableCopy
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            myTableId : BigInt(1),
                        },
                        {
                            myTableId : BigInt(2),
                        },
                    ]
                );
            await myTable2
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            myTable2Id : BigInt(1),
                        },
                        {
                            myTable2Id : BigInt(2),
                        },
                    ]
                );
            await myTable3
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            myTable3Id : BigInt(1),
                        },
                        {
                            myTable3Id : BigInt(2),
                        },
                    ]
                );

            await query
                .orderBy(columns => [
                    columns.myTable.myTableId.asc(),
                    columns.myAlias.myTableId.asc(),
                    columns.myAlias.myTable2Id.asc(),
                    columns.myAlias.myTable3Id.asc(),
                ])
                .fetchAll(connection)
                .then((results) => {
                    t.deepEqual(
                        results,
                        [
                            {
                                myTable : {
                                    myTableId : BigInt(1),
                                },
                                myAlias : {
                                    myTableId : BigInt(1),
                                    myTable2Id : BigInt(2),
                                    myTable3Id : BigInt(1),
                                    isNotNull : true,
                                }
                            },
                            {
                                myTable : {
                                    myTableId : BigInt(1),
                                },
                                myAlias : {
                                    myTableId : BigInt(1),
                                    myTable2Id : BigInt(2),
                                    myTable3Id : BigInt(2),
                                    isNotNull : true,
                                }
                            },
                            {
                                myTable : {
                                    myTableId : BigInt(1),
                                },
                                myAlias : {
                                    myTableId : BigInt(2),
                                    myTable2Id : BigInt(2),
                                    myTable3Id : BigInt(1),
                                    isNotNull : true,
                                }
                            },
                            {
                                myTable : {
                                    myTableId : BigInt(1),
                                },
                                myAlias : {
                                    myTableId : BigInt(2),
                                    myTable2Id : BigInt(2),
                                    myTable3Id : BigInt(2),
                                    isNotNull : true,
                                }
                            },
                        ]
                    );
                });
        });

        t.end();
    });
};
