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

        const resultSet = await pool.acquire(async (connection) => {
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

            return tsql.from(myTable)
                .select(columns => [
                    columns.myTableId,
                    columns.myTableVal.as("renamed"),
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
                ))
                .orderBy(columns => [
                    columns.renamed.as("stop-renaming-stuff").desc(),
                    columns.myTableId.as("stahp").asc(),
                ])
                .fetchAll(
                    connection
                );
        });

        t.deepEqual(
            resultSet,
            [
                {
                    myTableId : BigInt(3),
                    renamed : BigInt(300),
                },
                {
                    myTableId : BigInt(6),
                    renamed : BigInt(300),
                },
                {
                    myTableId : BigInt(5),
                    renamed : BigInt(200),
                },
            ]
        );

        t.end();
    });
};
