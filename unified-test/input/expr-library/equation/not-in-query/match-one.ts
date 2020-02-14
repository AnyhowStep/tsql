import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntSigned(),
                myTableVal : tm.mysql.bigIntSigned(),
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
                        myTableId : BigInt(0),
                        myTableVal : BigInt(0),
                    },
                    {
                        myTableId : BigInt(1),
                        myTableVal : BigInt(100),
                    },
                ]
            );
            await myTable
                .where(columns => tsql.notInQuery(
                    columns.myTableId,
                    tsql.selectValue(() => BigInt(-1))
                        .unionDistinct(
                            tsql.selectValue(() => BigInt(1))
                        )
                ))
                .fetchOne(connection)
                .then((row) => {
                    t.deepEqual(
                        row,
                        {
                            myTableId : BigInt(0),
                            myTableVal : BigInt(0),
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
