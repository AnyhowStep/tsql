import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned(),
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

            await myTable.whereEqPrimaryKey({
                    myTableId : BigInt(1),
                }).fetchOne(connection).or(
                1337
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

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    myTableId : BigInt(1),
                    /**
                     * This should get ignored as it is not part of the primary key.
                     */
                    createdAt : new Date(),
                } as any
            ).or(
                1337
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

            await myTable.whereEqPrimaryKey({
                    myTableId : BigInt(100),
                }).fetchOne(connection).or(
                1337
            ).then((row) => {
                t.deepEqual(row, 1337);
            }).catch(() => {
                t.fail("Should get defaultValue");
            });

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                } as any
            ).or(
                1337
            ).then(() => {
                t.fail("Should not execute");
            }).catch(() => {
                t.pass();
            });

            await myTable.where(() => true).delete(connection);

            await myTable.whereEqPrimaryKey({
                    myTableId : BigInt(1),
                }).fetchOne(connection).or(
                1337
            ).then((row) => {
                t.deepEqual(row, 1337);
            }).catch(() => {
                t.fail("Should get defaultValue");
            });

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    myTableId : BigInt(1),
                    /**
                     * This should get ignored as it is not part of the primary key.
                     */
                    createdAt : new Date(),
                } as any
            ).or(
                1337
            ).then((row) => {
                t.deepEqual(row, 1337);
            }).catch(() => {
                t.fail("Should get defaultValue");
            });

            await myTable.whereEqPrimaryKey({
                    myTableId : BigInt(100),
                }).fetchOne(connection).or(
                1337
            ).then((row) => {
                t.deepEqual(row, 1337);
            }).catch(() => {
                t.fail("Should get defaultValue");
            });

            await myTable.fetchOneByPrimaryKey(
                connection,
                {
                    createdAt : new Date("2015-01-01T00:00:00.000Z"),
                } as any
            ).or(
                1337
            ).then(() => {
                t.fail("Should not execute");
            }).catch(() => {
                t.pass();
            });

        });

        t.end();
    });
};
