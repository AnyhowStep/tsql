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

        const test2 = tsql.table("test2")
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
                .where(() => tsql.gt(
                    //This column is for a different table
                    //This should give us a run-time error
                    test2.columns.testVal,
                    BigInt(299)
                ) as any)
                .exists(connection)
                .then(() => {
                    t.fail("Should not execute");
                })
                .catch(() => {
                    t.pass("Should throw error");
                });

            await test
                .where(columns => tsql.gt(
                    columns.testVal,
                    BigInt(299)
                ))
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                });

            await test
                .where(columns => tsql.gt(
                    columns.testVal,
                    BigInt(300)
                ))
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                });

            await test.where(() => true).delete(connection);

            await test
                .where(() => tsql.gt(
                    //This column is for a different table
                    //This should give us a run-time error
                    test2.columns.testVal,
                    BigInt(299)
                ) as any)
                .exists(connection)
                .then(() => {
                    t.fail("Should not execute");
                })
                .catch(() => {
                    t.pass("Should throw error");
                });

            await test
                .where(columns => tsql.gt(
                    columns.testVal,
                    BigInt(299)
                ))
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                });

            await test
                .where(columns => tsql.gt(
                    columns.testVal,
                    BigInt(300)
                ))
                .exists(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                });

        });

        t.end();
    });
};
