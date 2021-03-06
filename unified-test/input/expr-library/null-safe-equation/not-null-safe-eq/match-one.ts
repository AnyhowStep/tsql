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
                        myTableId : BigInt(-1),
                        myTableVal : BigInt(-100),
                    },
                    {
                        myTableId : BigInt(-1),
                        myTableVal : BigInt(0),
                    },
                    {
                        myTableId : null,
                        myTableVal : BigInt(100),
                    },
                ]
            );
            await myTable
                .where(columns => tsql.notNullSafeEq(
                    columns.myTableId,
                    BigInt(-1)
                ))
                .fetchOne(connection)
                .then((row) => {
                    t.deepEqual(
                        row,
                        {
                            myTableId : null,
                            myTableVal : BigInt(100),
                        }
                    );
                })
                .catch((err) => {
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
