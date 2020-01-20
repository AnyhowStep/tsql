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

            return test.replaceOne(
                connection,
                {
                    testId : BigInt(5),
                    testVal : BigInt(400),
                }
            );
        });
        t.deepEqual(
            insertResult.insertedOrReplacedRowCount,
            BigInt(1)
        );
        t.deepEqual(
            insertResult.autoIncrementId,
            BigInt(5)
        );
        t.deepEqual(
            insertResult.warningCount,
            BigInt(0)
        );
        t.deepEqual(
            insertResult.testId,
            BigInt(5)
        );

        await pool
            .acquire(async (connection) => {
                return test.fetchOneByPrimaryKey(connection, { testId : BigInt(5) });
            })
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        testId : BigInt(5),
                        testVal : BigInt(400),
                    }
                );
            })
            .catch((err) => {
                console.error(err);
                t.fail("Should not fail");
            });

        t.end();
    });
};
