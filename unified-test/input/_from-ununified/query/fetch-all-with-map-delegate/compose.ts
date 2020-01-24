import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            });

        const other = tsql.table("other")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                otherVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        const resultSet = await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "test",
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
                                },
                            ],
                        },
                        {
                            tableAlias : "other",
                            columns : [
                                {
                                    columnAlias : "testId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "otherVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        },
                    ]
                }
            );

            await test
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
                            testVal : BigInt(300),
                        },
                    ]
                );

            await other
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            testId : BigInt(1),
                            otherVal : BigInt(111),
                        },
                        {
                            testId : BigInt(3),
                            otherVal : BigInt(333),
                        },
                    ]
                );

            return tsql.from(test)
                .innerJoinUsingPrimaryKey(
                    tables => tables.test,
                    other
                )
                .select(columns => [columns])
                .orderBy(columns => [
                    columns.test.testId.desc(),
                ])
                .map((row) => {
                    return {
                        test : row.test,
                        other2 : row.other,
                        total : tm.BigIntUtil.add(row.test.testVal, row.other.otherVal),
                    };
                })
                .map((row) => {
                    return {
                        ...row,
                        hello : "hi",
                    };
                })
                .fetchAll(
                    connection
                );
        });
        t.deepEqual(
            resultSet,
            [
                {
                    test: { testId: BigInt(3), testVal: BigInt(300) },
                    other2: { testId: BigInt(3), otherVal: BigInt(333) },
                    total: BigInt(633),
                    hello: "hi",
                },
                {
                    test: { testId: BigInt(1), testVal: BigInt(100) },
                    other2: { testId: BigInt(1), otherVal: BigInt(111) },
                total: BigInt(211),
                    hello: "hi",
                },
            ]
        );

        t.end();
    });
};
