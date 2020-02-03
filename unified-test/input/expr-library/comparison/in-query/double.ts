import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                value : tsql.dtDouble(),
            });
        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "value",
                                    dataType : {
                                        typeHint : tsql.TypeHint.DOUBLE,
                                    },
                                },
                            ],
                        },
                    ]
                }
            );

            await tsql
                .selectValue(() => tsql.inQuery(
                    1,
                    tsql
                        .from(myTable)
                        .selectValue(columns => columns.value)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.pass(err.message);
                });
        });

        await pool.acquire(async (connection) => {
            await myTable.insertOne(
                connection,
                {
                    value : 5
                },
            );

            await tsql
                .selectValue(() => tsql.inQuery(
                    1,
                    tsql
                        .from(myTable)
                        .selectValue(columns => columns.value)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.pass(err.message);
                });
        });

        await pool.acquireTransaction(async (connection) => {
            await myTable.insertOne(
                connection,
                {
                    value : 1
                },
            );

            await tsql
                .selectValue(() => tsql.inQuery(
                    1,
                    tsql
                        .from(myTable)
                        .selectValue(columns => columns.value)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await connection.rollback();
        });

        await pool.acquire(async (connection) => {
            await myTable.insertOne(
                connection,
                {
                    value : 8
                },
            );

            await tsql
                .selectValue(() => tsql.inQuery(
                    1,
                    tsql
                        .from(myTable)
                        .selectValue(columns => columns.value)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                })
                .catch((err) => {
                    t.pass(err.message);
                });
        });

        await pool.acquireTransaction(async (connection) => {
            await myTable.insertOne(
                connection,
                {
                    value : 1
                },
            );

            await tsql
                .selectValue(() => tsql.inQuery(
                    1,
                    tsql
                        .from(myTable)
                        .selectValue(columns => columns.value)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.pass(err.message);
                });

            await connection.rollback();
        });

        t.end();
    });
};
