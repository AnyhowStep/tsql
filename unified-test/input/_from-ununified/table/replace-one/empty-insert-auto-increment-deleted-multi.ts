import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
                testVal2 : tm.mysql.bigIntUnsigned(),
            })
            .setAutoIncrement(columns => columns.testId)
            .addExplicitDefaultValue(columns => [
                columns.testVal,
                columns.testVal2,
            ]);

        const insertResult = await pool.acquire(async (connection) => {
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
                                    default : BigInt(1337),
                                },
                                {
                                    columnAlias : "testVal2",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    default : BigInt(1337),
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "testId",
                                autoIncrement : true,
                            },
                            candidateKeys : [
                                ["testVal"],
                                ["testVal2"],
                            ],
                        }
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
                            testVal2 : BigInt(100),
                        },
                        {
                            testId : BigInt(2),
                            testVal : BigInt(200),
                            testVal2 : BigInt(1337),
                        },
                        {
                            testId : BigInt(3),
                            testVal : BigInt(1337),
                            testVal2 : BigInt(300),
                        },
                    ]
                );

            return test.replaceOne(
                connection,
                {}
            );
        });
        t.deepEqual(
            insertResult.insertedOrReplacedRowCount,
            BigInt(1)
        );
        t.deepEqual(
            insertResult.autoIncrementId,
            BigInt(4)
        );
        t.deepEqual(
            insertResult.warningCount,
            BigInt(0)
        );

        await pool
            .acquire(async (connection) => {
                await test.existsByPrimaryKey(connection, { testId : BigInt(2) })
                    .then((result) => {
                        t.deepEqual(result, false);
                    });
                await test.existsByPrimaryKey(connection, { testId : BigInt(3) })
                    .then((result) => {
                        t.deepEqual(result, false);
                    });
                return test.fetchOneByPrimaryKey(connection, { testId : BigInt(4) });
            })
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        testId : BigInt(4),
                        testVal : BigInt(1337),
                        testVal2 : BigInt(1337),
                    }
                );
            });

        t.end();
    });
};
