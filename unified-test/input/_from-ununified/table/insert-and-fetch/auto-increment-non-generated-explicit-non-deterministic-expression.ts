import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tsql.dtBigIntSigned(),
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

            return test.insertAndFetch(
                connection,
                {
                    testId : tsql.integer.randomBigIntSigned(),
                    testVal : BigInt(400),
                }
            );
        });
        t.true(
            tm.TypeUtil.isBigInt(insertResult.testId)
        );
        t.deepEqual(
            insertResult.testVal,
            BigInt(400)
        );

        await pool
            .acquire(async (connection) => {
                return test.whereEqPrimaryKey(insertResult).fetchOne(connection);
            })
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        testId : insertResult.testId,
                        testVal : BigInt(400),
                    }
                );
            });

        await pool
            .acquire(async (connection) => {
                return tsql.from(test).count(connection);
            })
            .then((count) => {
                t.deepEqual(
                    count,
                    BigInt(4)
                );
            })
            .catch((err) => {
                console.error(err);
                t.fail("Should not fail");
            });

        t.end();
    });
};
