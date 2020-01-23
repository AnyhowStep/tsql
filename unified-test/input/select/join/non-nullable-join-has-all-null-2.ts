import * as tm from "type-mapping";
import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const tableA = tsql.table("tableA")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned().orNull(),
            })
            .setPrimaryKey(columns => [columns.testId]);
        const tableB = tsql.table("tableB")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned().orNull(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "tableA",
                            columns : [
                                {
                                    columnAlias : "testId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "testId",
                                autoIncrement : false,
                            },
                        },
                        {
                            tableAlias : "tableB",
                            columns : [
                                {
                                    columnAlias : "testId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "testId",
                                autoIncrement : false,
                            },
                        },
                    ]
                }
            );

            await tableA
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            testId : BigInt(1),
                            testVal : BigInt(100),
                        },
                        {
                            testId : BigInt(2),
                            testVal : BigInt(200),
                        },
                        {
                            testId : BigInt(3),
                            testVal : null,
                        },
                        {
                            testId : BigInt(4),
                            testVal : null,
                        },
                    ]
                );

            await tableB
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            testId : BigInt(1),
                            testVal : BigInt(100),
                        },
                        /**
                         * testId 2 is missing
                         */
                        {
                            testId : BigInt(3),
                            testVal : BigInt(300),
                        },
                        /**
                         * testId 4 exists, but has a `null` value.
                         */
                        {
                            testId : BigInt(4),
                            testVal : null,
                        },
                    ]
                );

            await tsql.from(tableA)
                .leftJoinUsingPrimaryKey(
                    tables => tables.tableA,
                    tableB
                )
                .select(columns => [
                    columns.tableA.testVal,
                    columns.tableB.testVal,
                ])
                .orderBy(columns => [
                    columns.tableA.testId.asc(),
                ])
                .fetchAll(connection)
                .then((results) => {
                    /**
                     * The type of `results` is currently,
                     * ```ts
                     * (parameter) results: {
                     *   readonly tableA: {
                     *     readonly testVal: bigint | null;
                     *   };
                     *   readonly tableB?: {
                     *     readonly testVal: bigint | null;
                     *   } | undefined;
                     * }[]
                     * ```
                     *
                     * Ideally, it would be,
                     * ```ts
                     * (parameter) results: {
                     *   readonly tableA: {
                     *     readonly testVal: bigint | null;
                     *   };
                     *   readonly tableB?: {
                     *     readonly testVal: bigint;
                     *   } | undefined;
                     * }[]
                     * ```
                     *
                     * But this is an edge case where the `LEFT JOIN`'d table alias only
                     * has one nullable column selected.
                     *
                     * @todo Improve the compile-time type for this edge case?
                     *
                     */
                    t.deepEqual(
                        results,
                        [
                            {
                                tableA : { testVal : BigInt(100) },
                                tableB : { testVal : BigInt(100) },
                            },
                            {
                                tableA : { testVal : BigInt(200) },
                                tableB : undefined,
                            },
                            {
                                tableA : { testVal : null },
                                tableB : { testVal : BigInt(300) },
                            },
                            {
                                tableA : { testVal : null },
                                tableB : undefined,
                            },
                        ]
                    );
                });
        });

        t.end();
    });
};
