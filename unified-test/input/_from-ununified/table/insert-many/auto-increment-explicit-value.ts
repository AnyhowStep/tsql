import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .setAutoIncrement(columns => columns.testId)
            .enableExplicitAutoIncrementValue();

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
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "testId",
                                autoIncrement : true,
                            },
                        }
                    ]
                }
            );

            return test.insertMany(
                connection,
                [
                    {
                        testVal : BigInt(100),
                    },
                    {
                        testId : BigInt(999),
                        testVal : BigInt(200),
                    },
                    {
                        testVal : BigInt(300),
                    },
                ]
            );
        });
        t.deepEqual(
            insertResult.insertedRowCount,
            BigInt(3)
        );
        t.deepEqual(
            insertResult.warningCount,
            BigInt(0)
        );

        await pool
            .acquire(async (connection) => {
                return tsql.from(test)
                    .select(columns => [columns])
                    .orderBy(columns => [
                        columns.testId.asc(),
                    ])
                    .fetchAll(connection);
            })
            .then((rows) => {
                t.deepEqual(
                    rows,
                    [
                        {
                            testId : BigInt(1),
                            testVal : BigInt(100),
                        },
                        {
                            testId : BigInt(999),
                            testVal : BigInt(200),
                        },
                        {
                            testId : BigInt(1000),
                            testVal : BigInt(300),
                        },
                    ]
                );
            });

        t.end();
    });
};
