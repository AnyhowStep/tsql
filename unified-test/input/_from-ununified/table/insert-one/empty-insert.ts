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
            .setPrimaryKey(columns => [columns.testId])
            .addExplicitDefaultValue(columns => [
                columns.testId,
                columns.testVal,
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
                                    default : BigInt(80085),
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    default : BigInt(1337),
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "testId",
                                autoIncrement : false,
                            },
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

            return test.insertOne(
                connection,
                {}
            );
        });
        t.deepEqual(
            insertResult.insertedRowCount,
            BigInt(1)
        );
        t.deepEqual(
            insertResult.autoIncrementId,
            undefined
        );
        t.deepEqual(
            insertResult.warningCount,
            BigInt(0)
        );

        await pool
            .acquire(async (connection) => {
                return test.whereEqPrimaryKey({ testId : BigInt(80085) }).fetchOne(connection);
            })
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        testId : BigInt(80085),
                        testVal : BigInt(1337),
                    }
                );
            });

        t.end();
    });
};
