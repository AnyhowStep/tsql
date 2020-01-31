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
                            myTableId : BigInt(1),
                            myTableVal : BigInt(1000),
                        },
                        {
                            myTableId : BigInt(2),
                            myTableVal : BigInt(2000),
                        },
                        {
                            myTableId : BigInt(3),
                            myTableVal : BigInt(3000),
                        },
                    ]
                );

            return tsql
                .from(myTable)
                .groupBy(columns => [
                    columns.myTableId,
                ])
                .select(columns => [
                    columns.myTableId,
                    tsql.integer.max(
                        columns.myTableVal
                    ).as("x"),
                    tsql.integer.add(
                        columns.myTableId
                    ).as("y"),
                ])
                .orderBy((columns) => {
                    t.true(tsql.ExprColumnUtil.isExprColumn(columns.$aliased.x));
                    t.true(tsql.BuiltInExprUtil.isAggregate(columns.$aliased.x));

                    t.true(tsql.ExprColumnUtil.isExprColumn(columns.$aliased.y));
                    t.false(tsql.BuiltInExprUtil.isAggregate(columns.$aliased.y));

                    t.false(tsql.ExprColumnUtil.isExprColumn(columns.myTable.myTableId));
                    t.false(tsql.BuiltInExprUtil.isAggregate(columns.myTable.myTableId));

                    t.false(tsql.ExprColumnUtil.isExprColumn(columns.myTable.myTableVal));
                    t.false(tsql.BuiltInExprUtil.isAggregate(columns.myTable.myTableVal));

                    return [
                        tsql.isNotNull(columns.$aliased.x).asc(),
                        tsql.isNotNull(columns.$aliased.y).asc(),
                        columns.$aliased.x.asc(),
                    ];
                })
                .fetchAll(connection);
        });

        t.deepEqual(
            resultSet,
            [
                {
                    myTableId : BigInt(1),
                    x : BigInt(1000),
                    y : BigInt(1),
                },
                {
                    myTableId : BigInt(2),
                    x : BigInt(2000),
                    y : BigInt(2),
                },
                {
                    myTableId : BigInt(3),
                    x : BigInt(3000),
                    y : BigInt(3),
                },
            ]
        );

        t.end();
    });
};
