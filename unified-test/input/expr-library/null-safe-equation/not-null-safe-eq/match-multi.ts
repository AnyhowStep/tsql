import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned().orNull(),
                myTableVal : tm.mysql.bigIntSigned(),
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
                                    nullable : true,
                                },
                                {
                                    columnAlias : "myTableVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
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
                        myTableId : BigInt(2),
                        myTableVal : BigInt(200),
                    },
                    {
                        myTableId : BigInt(2),
                        myTableVal : BigInt(200),
                    },
                    {
                        myTableId : BigInt(3),
                        myTableVal : BigInt(300),
                    },
                    {
                        myTableId : BigInt(4),
                        myTableVal : BigInt(400),
                    },
                    {
                        myTableId : BigInt(5),
                        myTableVal : BigInt(500),
                    },
                    {
                        myTableId : null,
                        myTableVal : BigInt(999),
                    },
                    {
                        myTableId : null,
                        myTableVal : BigInt(998),
                    },
                ]
            );
            await tsql.from(myTable)
                .where(columns => tsql.notNullSafeEq(
                    columns.myTableId,
                    BigInt(2)
                ))
                .orderBy(columns => [
                    columns.myTableVal.desc(),
                ])
                .select(columns => [columns])
                .fetchAll(connection)
                .then((rows) => {
                    t.deepEqual(
                        rows,
                        [
                            {
                                myTableId : null,
                                myTableVal : BigInt(999),
                            },
                            {
                                myTableId : null,
                                myTableVal : BigInt(998),
                            },
                            {
                                myTableId : BigInt(5),
                                myTableVal : BigInt(500),
                            },
                            {
                                myTableId : BigInt(4),
                                myTableVal : BigInt(400),
                            },
                            {
                                myTableId : BigInt(3),
                                myTableVal : BigInt(300),
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
