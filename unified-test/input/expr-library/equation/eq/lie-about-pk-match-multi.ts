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
            /**
             * Declare this a primary key
             */
            .setPrimaryKey(columns => [columns.myTableId]);

        await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        /**
                         * But we don't actually make it a primary key on the database
                         */
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
                        myTableId : BigInt(3),
                        myTableVal : BigInt(300),
                    },
                    {
                        myTableId : BigInt(3),
                        myTableVal : BigInt(300),
                    },
                ]
            );
            for (let i=2; i<=3; ++i) {
                await tsql.from(myTable)
                    .where(columns => tsql.eq(
                        columns.myTableId,
                        BigInt(i)
                    ))
                    .select(columns => [columns])
                    .fetchAll(connection)
                    .then((rows) => {
                        t.deepEqual(rows.length, i);
                        rows.forEach(row => t.deepEqual(
                            row,
                            {
                                myTableId : BigInt(i),
                                myTableVal : BigInt(i*100),
                            }
                        ));
                    })
                    .catch((err) => {
                        t.fail(err.message);
                    });
            }
        });

        t.end();
    });
};
