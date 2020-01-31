import * as tm from "type-mapping";
import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const otherTable = tsql.table("otherTable")
            .addColumns({
                otherTableId : tm.mysql.bigIntUnsigned(),
                otherTableVal : tm.mysql.bigIntUnsigned(),
            });

        const resultSet = await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
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

            await otherTable
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            otherTableId : BigInt(1),
                            otherTableVal : BigInt(150),
                        },
                        {
                            otherTableId : BigInt(2),
                            otherTableVal : BigInt(250),
                        },
                        {
                            otherTableId : BigInt(3),
                            otherTableVal : BigInt(350),
                        },
                        {
                            otherTableId : BigInt(4),
                            otherTableVal : BigInt(150),
                        },
                        {
                            otherTableId : BigInt(5),
                            otherTableVal : BigInt(250),
                        },
                        {
                            otherTableId : BigInt(6),
                            otherTableVal : BigInt(350),
                        },
                    ]
                );

            return tsql.from(
                /**
                 * Use a derived table to pretend to be another table
                 */
                tsql.from(otherTable)
                    .select(columns => [
                        columns.otherTableId.as("myTableId"),
                        columns.otherTableVal.as("myTableVal"),
                    ])
                    .as("myTable")
            )
                .select(columns => [
                    columns.myTableId,
                    columns.myTableVal.as("renamed"),
                ])
                .where(columns => tsql.and(
                    tsql.gt(
                        columns.myTableVal.as("blah"),
                        BigInt(150)
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
                        BigInt(150)
                    ),
                    tsql.notEq(
                        columns.myTableId.as("blah"),
                        BigInt(2)
                    )
                ))
                .orderBy(columns => [
                    columns.renamed.desc(),
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
                    renamed : BigInt(350),
                },
                {
                    myTableId : BigInt(6),
                    renamed : BigInt(350),
                },
                {
                    myTableId : BigInt(5),
                    renamed : BigInt(250),
                },
            ]
        );

        t.end();
    });
};
