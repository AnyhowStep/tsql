import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned(),
                createdAt : tm.mysql.dateTime(3),
            })
            .setPrimaryKey(columns => [columns.myTableId]);

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "myTableId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "createdAt",
                                    dataType : {
                                        typeHint : tsql.TypeHint.DATE_TIME,
                                    },
                                },
                            ],
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "myTableId",
                                autoIncrement : false,
                            },
                        }
                    ]
                }
            );

            await myTable
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            myTableId : BigInt(1),
                            createdAt : new Date("2015-01-01T00:00:00.000Z"),
                        },
                        {
                            myTableId : BigInt(2),
                            createdAt : new Date("2015-01-02T00:00:00.000Z"),
                        },
                        {
                            myTableId : BigInt(3),
                            createdAt : new Date("2015-01-03T00:00:00.000Z"),
                        },
                    ]
                );

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [columns]
            ).then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            }).catch(() => {
                t.fail("Should exist");
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                },
                columns => [columns]
            ).then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            }).catch(() => {
                t.fail("Should exist");
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                    createdAt : new Date("2015-01-01T00:00:00.001Z"),
                },
                columns => [columns]
            ).then(() => {
                t.fail("Should not exist");
            }).catch((err) => {
                t.true(err instanceof tsql.RowNotFoundError);
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                } as any,
                columns => [columns]
            ).then(() => {
                t.fail("Should not execute");
            }).catch((err) => {
                t.false(err instanceof tsql.RowNotFoundError);
                t.false(err instanceof tsql.TooManyRowsFoundError);
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [columns.myTableId]
            ).then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                    }
                );
            }).catch(() => {
                t.fail("Should exist");
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [columns.createdAt]
            ).then((row) => {
                t.deepEqual(
                    row,
                    {
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            }).catch(() => {
                t.fail("Should exist");
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [columns.createdAt, columns.myTableId]
            ).then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            }).catch(() => {
                t.fail("Should exist");
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("dayAfterCreation")]
            ).then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : BigInt(1),
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                        dayAfterCreation : new Date("2015-01-02T00:00:00.000Z"),
                    }
                );
            }).catch(() => {
                t.fail("Should exist");
            });

            await myTable.where(() => true).delete(connection);

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [columns]
            ).then(() => {
                t.fail("Should not exist");
            }).catch(() => {
                t.pass();
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [columns.myTableId]
            ).then(() => {
                t.fail("Should not exist");
            }).catch(() => {
                t.pass();
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [columns.createdAt]
            ).then(() => {
                t.fail("Should not exist");
            }).catch(() => {
                t.pass();
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [columns.createdAt, columns.myTableId]
            ).then(() => {
                t.fail("Should not exist");
            }).catch(() => {
                t.pass();
            });

            await myTable.fetchOneBySuperKey(
                connection,
                {
                    myTableId : BigInt(1),
                },
                columns => [
                    columns.createdAt,
                    columns.myTableId,
                    tsql.timestampAddDay(columns.createdAt, BigInt(1)).as("dayAfterCreation")]
            ).then(() => {
                t.fail("Should not exist");
            }).catch(() => {
                t.pass();
            });

        });

        t.end();
    });
};