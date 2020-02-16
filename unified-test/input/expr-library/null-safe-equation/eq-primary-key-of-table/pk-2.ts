import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                col1 : tm.mysql.bigIntSigned().orNull(),
                col2 : tm.mysql.bigIntSigned().orNull(),
                col3 : tm.mysql.bigIntSigned().orNull(),
            });
        const otherTable = tsql.table("otherTable")
            .addColumns({
                col1 : tm.mysql.bigIntSigned(),
                col2 : tm.mysql.bigIntSigned(),
                col3 : tm.mysql.bigIntSigned().orNull(),
            })
            .setPrimaryKey(columns => [columns.col1, columns.col2]);

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "myTable",
                            columns : [
                                {
                                    columnAlias : "col1",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                                {
                                    columnAlias : "col2",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                                {
                                    columnAlias : "col3",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                            ],
                        },
                        {
                            tableAlias : "otherTable",
                            columns : [
                                {
                                    columnAlias : "col1",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : false,
                                },
                                {
                                    columnAlias : "col2",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                                {
                                    columnAlias : "col3",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                            ],
                        },
                    ]
                }
            );

            const myTableRows = [
                {
                    col1 : null,
                    col2 : BigInt(1),
                    col3 : BigInt(1),
                },
                {
                    col1 : null,
                    col2 : BigInt(2),
                    col3 : BigInt(2),
                },
                {
                    col1 : BigInt(1),
                    col2 : BigInt(1),
                    col3 : BigInt(1),
                },
                {
                    col1 : BigInt(1),
                    col2 : BigInt(2),
                    col3 : BigInt(1),
                },
                {
                    col1 : BigInt(2),
                    col2 : BigInt(1),
                    col3 : BigInt(2),
                },
                {
                    col1 : BigInt(2),
                    col2 : BigInt(2),
                    col3 : BigInt(2),
                },
            ];

            await myTable.insertMany(
                connection,
                myTableRows
            );
            await otherTable.insertMany(
                connection,
                [
                    {
                        col1 : BigInt(1),
                        col2 : BigInt(1),
                        col3 : BigInt(1000),
                    },
                    {
                        col1 : BigInt(2),
                        col2 : BigInt(2),
                        col3 : BigInt(2000),
                    },
                    {
                        col1 : BigInt(3),
                        col2 : BigInt(3),
                        col3 : BigInt(3000),
                    },
                ]
            );
            await tsql.from(myTable)
                .leftJoin(
                    otherTable,
                    () => tsql.eqPrimaryKeyOfTable(
                        myTable,
                        otherTable
                    )
                )
                .orderBy(columns => [
                    tsql.isNull(columns.myTable.col1).desc(),
                    columns.myTable.col1.asc(),
                    columns.myTable.col2.asc(),
                ])
                .select(columns => [columns])
                .fetchAll(connection)
                .then((rows) => {
                    t.deepEqual(
                        rows,
                        myTableRows.map(myTableRow => {
                            return {
                                myTable : myTableRow,
                                otherTable : (
                                    (
                                        myTableRow.col1 == null ||
                                        Number(myTableRow.col1) == 3 ||
                                        Number(myTableRow.col1) != Number(myTableRow.col2)
                                    ) ?
                                    undefined :
                                    {
                                        col1 : myTableRow.col1,
                                        col2 : myTableRow.col1,
                                        col3 : BigInt(Number(myTableRow.col1)*1000),
                                    }
                                ),
                            };
                        })
                    );
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
