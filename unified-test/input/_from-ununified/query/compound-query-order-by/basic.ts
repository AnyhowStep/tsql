import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myColumn : tm.mysql.bigIntUnsigned(),
            });
        const otherTable = tsql.table("otherTable")
            .addColumns({
                otherColumn : tm.mysql.bigIntUnsigned(),
            });

        const myQuery = tsql
            .from(myTable)
            .select(columns => [
                tsql.integer.add(
                    columns.myColumn,
                    BigInt(32)
                ).as("x")
            ])
            .unionAll(
                tsql
                    .from(otherTable)
                    .select(columns => [
                        columns.otherColumn
                    ])
            )
            .compoundQueryOrderBy((columns) => [
                //Alias in `SELECT` clause of first query
                columns.x.desc(),
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
                                    columnAlias : "myColumn",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "myColumn",
                                autoIncrement : false,
                            },
                        },
                        {
                            tableAlias : "otherTable",
                            columns : [
                                {
                                    columnAlias : "otherColumn",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "otherColumn",
                                autoIncrement : false,
                            },
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
                            myColumn : BigInt(0),
                        },
                        {
                            myColumn : BigInt(2),
                        },
                        {
                            myColumn : BigInt(4),
                        },
                    ]
                );

            await otherTable
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            otherColumn : BigInt(31),
                        },
                        {
                            otherColumn : BigInt(33),
                        },
                        {
                            otherColumn : BigInt(35),
                        },
                        {
                            otherColumn : BigInt(37),
                        },
                    ]
                );

            await myQuery
                .fetchAll(connection)
                .then((results) => {
                    t.deepEqual(
                        results,
                        [
                            {
                                x : BigInt(37),
                            },
                            {
                                x : BigInt(36),
                            },
                            {
                                x : BigInt(35),
                            },
                            {
                                x : BigInt(34),
                            },
                            {
                                x : BigInt(33),
                            },
                            {
                                x : BigInt(32),
                            },
                            {
                                x : BigInt(31),
                            },
                        ]
                    );
                });
        });

        t.end();
    });
};
