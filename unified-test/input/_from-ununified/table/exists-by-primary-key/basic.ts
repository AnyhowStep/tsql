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
            .setPrimaryKey(columns => [columns.testId]);

        await pool.acquire(async (connection) => {
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

            await test
                .whereEqPrimaryKey(
                    {
                        testVal : BigInt(200),
                    } as any
                )
                .exists(connection)
                .then(() => {
                    t.fail("Should not execute");
                })
                .catch(() => {
                    t.pass("Should throw error");
                });

            await test
                .whereEqPrimaryKey(
                    {
                        testId : BigInt(2),
                    }
                )
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                });

            await test
                .whereEqPrimaryKey(
                    {
                        testId : BigInt(2),
                        testVal : BigInt(999), //Should get ignored
                    } as any
                )
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                });

            await test
                .whereEqPrimaryKey(
                    {
                        testId : BigInt(4),
                    }
                )
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                });

            await test.where(() => true).delete(connection);

            await test
                .whereEqPrimaryKey(
                    {
                        testVal : BigInt(200),
                    } as any
                )
                .exists(connection)
                .then(() => {
                    t.fail("Should not execute");
                })
                .catch(() => {
                    t.pass("Should throw error");
                });

            await test
                .whereEqPrimaryKey(
                    {
                        testId : BigInt(2),
                    }
                )
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                });

            await test
                .whereEqPrimaryKey(
                    {
                        testId : BigInt(2),
                        testVal : BigInt(999), //Should get ignored
                    } as any
                )
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                });

            await test
                .whereEqPrimaryKey(
                    {
                        testId : BigInt(4),
                    }
                )
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                });

        });

        t.end();
    });
};
