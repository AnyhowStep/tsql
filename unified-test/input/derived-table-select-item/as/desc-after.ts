import * as tm from "type-mapping";
import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntUnsigned(),
                myTableVal : tm.mysql.bigIntUnsigned(),
            });
        const otherTable = tsql.table("otherTable")
            .addColumns({
                otherTableId : tm.mysql.bigIntUnsigned(),
                otherTableVal : tm.mysql.bigIntUnsigned(),
            });

        const resultSets = await pool.acquire(async (connection) => {
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
                                },
                            ],
                        },
                        {
                            tableAlias : "otherTable",
                            columns : [
                                {
                                    columnAlias : "otherTableId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "otherTableVal",
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
                            myTableVal : BigInt(100),
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
                            myTableId : BigInt(4),
                            myTableVal : BigInt(100),
                        },
                        {
                            myTableId : BigInt(5),
                            myTableVal : BigInt(200),
                        },
                        {
                            myTableId : BigInt(6),
                            myTableVal : BigInt(300),
                        },
                    ]
                );

            await otherTable
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            otherTableId : BigInt(1),
                            otherTableVal : BigInt(100),
                        },
                        {
                            otherTableId : BigInt(2),
                            otherTableVal : BigInt(200),
                        },
                        {
                            otherTableId : BigInt(3),
                            otherTableVal : BigInt(300),
                        },
                        {
                            otherTableId : BigInt(4),
                            otherTableVal : BigInt(100),
                        },
                        {
                            otherTableId : BigInt(5),
                            otherTableVal : BigInt(200),
                        },
                        {
                            otherTableId : BigInt(6),
                            otherTableVal : BigInt(300),
                        },
                    ]
                );

            const query = tsql
                .from(myTable)
                .select(columns => [
                    columns.myTableId,
                    tsql
                        .requireOuterQueryJoins(myTable)
                        .from(otherTable.as("sub"))
                        .selectValue(columns => columns.sub.otherTableVal)
                        .where(columns => tsql.eq(
                            columns.myTable.myTableId,
                            columns.sub.otherTableId
                        ))
                        .limit(1)
                        .as("renamed")
                        .as("renamed2"),
                ])
                .where(columns => tsql.and(
                    tsql.gt(
                        columns.myTableVal.as("blah"),
                        BigInt(100)
                    ),
                    tsql.notEq(
                        columns.myTableId,
                        BigInt(2)
                    )
                ))
                .groupBy(columns => [
                    columns.myTableId,
                    columns.myTableVal,
                ])
                .having(columns => tsql.and(
                    tsql.gt(
                        columns.myTableVal,
                        BigInt(100)
                    ),
                    tsql.notEq(
                        columns.myTableId.as("blah"),
                        BigInt(2)
                    )
                ));

            return Promise.all([
                query
                    .orderBy(columns => [
                        columns.$aliased.renamed2.desc(),
                        columns.myTable.myTableId.as("stahp").asc(),
                    ])
                    .fetchAll(
                        connection
                    ),
                query
                    .orderBy(columns => [
                        columns.$aliased.renamed2.as("stop-renaming-stuff").desc(),
                        columns.myTable.myTableId.as("stahp").asc(),
                    ])
                    .fetchAll(
                        connection
                    ),
                query
                    .orderBy(columns => [
                        columns.$aliased.renamed2.sort(tsql.SortDirection.DESC),
                        columns.myTable.myTableId.as("stahp").asc(),
                    ])
                    .fetchAll(
                        connection
                    ),
                query
                    .orderBy(columns => [
                        columns.$aliased.renamed2.as("stop-renaming-stuff").sort(tsql.SortDirection.DESC),
                        columns.myTable.myTableId.as("stahp").asc(),
                    ])
                    .fetchAll(
                        connection
                    ),
            ]);
        });

        for (const resultSet of resultSets) {
            t.deepEqual(
                resultSet,
                [
                    {
                        myTableId : BigInt(3),
                        renamed2 : BigInt(300),
                    },
                    {
                        myTableId : BigInt(6),
                        renamed2 : BigInt(300),
                    },
                    {
                        myTableId : BigInt(5),
                        renamed2 : BigInt(200),
                    },
                ]
            );
        }

        t.end();
    });
};
