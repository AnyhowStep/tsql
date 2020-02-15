import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned(),
                myTableVal : tm.mysql.bigIntSigned().orNull(),
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
                                    columnAlias : "myTableId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "myTableVal",
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

            await myTable.insertMany(
                connection,
                [
                    {
                        myTableId : BigInt(-1),
                        myTableVal : BigInt(-100),
                    },
                    {
                        myTableId : BigInt(0),
                        myTableVal : BigInt(0),
                    },
                    {
                        myTableId : BigInt(1),
                        myTableVal : BigInt(100),
                    },
                    {
                        myTableId : BigInt(2),
                        myTableVal : null,
                    },
                ]
            );
            await tsql.from(myTable)
                .select(columns => [
                    columns.myTableId,
                    tsql.isNotNullAnd(
                        columns.myTableVal,
                        ({myTableVal}) => tsql.gtEq(myTableVal, BigInt(0))
                    ).as("v")
                ])
                .orderBy(columns => [
                    columns.myTable.myTableId.desc(),
                ])
                .fetchAll(connection)
                .then((rows) => {
                    t.deepEqual(
                        rows,
                        [
                            {
                                myTableId : BigInt(2),
                                v : false,
                            },
                            {
                                myTableId : BigInt(1),
                                v : true,
                            },
                            {
                                myTableId : BigInt(0),
                                v : true,
                            },
                            {
                                myTableId : BigInt(-1),
                                v : false,
                            },
                        ]
                    );
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
