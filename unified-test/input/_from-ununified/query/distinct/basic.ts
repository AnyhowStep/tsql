import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntUnsigned(),
            });

        const query = tsql.from(myTable)
            .select(columns => [columns])
            .orderBy(columns => [
                columns.myTableId.asc(),
            ])
            .distinct();


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
                            ],
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
                        },
                        {
                            myTableId : BigInt(1),
                        },
                        {
                            myTableId : BigInt(2),
                        },
                        {
                            myTableId : BigInt(3),
                        },
                        {
                            myTableId : BigInt(2),
                        },
                        {
                            myTableId : BigInt(3),
                        },
                    ]
                );

            await query
                .fetchAll(connection)
                .then((results) => {
                    t.deepEqual(
                        results,
                        [
                            {
                                myTableId : BigInt(1),
                            },
                            {
                                myTableId : BigInt(2),
                            },
                            {
                                myTableId : BigInt(3),
                            },
                        ]
                    );
                });
        });

        t.end();
    });
};
