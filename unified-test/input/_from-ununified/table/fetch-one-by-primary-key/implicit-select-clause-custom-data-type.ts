import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {dtPoint} from "../../dt-point";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : dtPoint,
                createdAt : tm.mysql.dateTime(),
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
                                        typeHint : tsql.TypeHint.STRING,
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
                                columnAlias : "testId",
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
                            myTableId : {x:1,y:2},
                            createdAt : new Date("2015-01-01T00:00:00.000Z"),
                        },
                        {
                            myTableId : {x:2,y:2},
                            createdAt : new Date("2015-01-02T00:00:00.000Z"),
                        },
                        {
                            myTableId : {x:3,y:2},
                            createdAt : new Date("2015-01-03T00:00:00.000Z"),
                        },
                    ]
                );

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    myTableId : {
                        x : 1,
                        y : 2,
                    },
                }
            ).then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : {
                            x : 1,
                            y : 2,
                        },
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            }).catch(() => {
                t.fail("Should exist");
            });

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    myTableId : {
                        x : 1,
                        y : 2,
                    },
                    /**
                     * This should get ignored as it is not part of the primary key.
                     */
                    createdAt : new Date(),
                } as any
            ).then((row) => {
                t.deepEqual(
                    row,
                    {
                        myTableId : {
                            x : 1,
                            y : 2,
                        },
                        createdAt : new Date("2015-01-01T00:00:00.000Z"),
                    }
                );
            }).catch(() => {
                t.fail("Should exist");
            });

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    myTableId : {
                        x : 100,
                        y : 2,
                    },
                }
            ).then(() => {
                t.fail("Should not exist");
            }).catch(() => {
                t.pass();
            });

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                } as any
            ).then(() => {
                t.fail("Should not execute");
            }).catch(() => {
                t.pass();
            });

            await myTable.where(() => true).delete(connection);

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    myTableId : {
                        x : 1,
                        y : 2,
                    },
                }
            ).then(() => {
                t.fail("Should not exist");
            }).catch(() => {
                t.pass();
            });

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    myTableId : {
                        x : 1,
                        y : 2,
                    },
                    /**
                     * This should get ignored as it is not part of the primary key.
                     */
                    createdAt : new Date(),
                } as any
            ).then(() => {
                t.fail("Should not exist");
            }).catch(() => {
                t.pass();
            });

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    myTableId : {
                        x : 100,
                        y : 2,
                    },
                }
            ).then(() => {
                t.fail("Should not exist");
            }).catch(() => {
                t.pass();
            });

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                } as any
            ).then(() => {
                t.fail("Should not execute");
            }).catch(() => {
                t.pass();
            });

        });

        t.end();
    });
};
