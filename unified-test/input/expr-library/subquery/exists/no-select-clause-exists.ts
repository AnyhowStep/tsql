import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                col1 : tm.mysql.bigIntSigned().orNull(),
                col2 : tm.mysql.bigIntSigned().orNull(),
            })
            .addCandidateKey(columns => [columns.col1]);

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
                            ],
                        },
                    ]
                }
            );

            await myTable.insertMany(
                connection,
                [
                    {
                        col1 : null,
                        col2 : BigInt(1000),
                    },
                    {
                        col1 : null,
                        col2 : BigInt(2000),
                    },
                    {
                        col1 : BigInt(1),
                        col2 : BigInt(1),
                    },
                    {
                        col1 : BigInt(2),
                        col2 : BigInt(2),
                    },
                ]
            );

            await tsql
                .selectValue(() => tsql.exists(
                    tsql.from(myTable)
                        .where(columns => tsql.isNull(columns.col1))
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });

            await tsql
                .selectValue(() => tsql.exists(
                    tsql.from(myTable)
                        .where(() => true)
                ))
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                })
                .catch((err) => {
                    t.fail(err.message);
                    t.fail(err.sql);
                });
        });

        t.end();
    });
};
