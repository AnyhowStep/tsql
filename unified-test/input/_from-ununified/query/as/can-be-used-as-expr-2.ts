import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntUnsigned(),
            });

        const somethingElse = tsql.table("somethingElse")
            .addColumns({
                boop : tm.mysql.bigIntUnsigned(),
            });

        const aliased = tsql.coalesce(
            tsql
                .requireOuterQueryJoins(somethingElse)
                .from(myTable)
                .select(c => [
                    tsql.gt(
                        c.myTable.myTableId,
                        c.somethingElse.boop
                    ).as("result")
                ])
                .limit(1)
                .as("myAlias"),
            null
        ).as("Will be overwritten");

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
                        },
                        {
                            tableAlias : "somethingElse",
                            columns : [
                                {
                                    columnAlias : "boop",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        },
                    ]
                }
            );

            await myTable
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            myTableId : BigInt(2),
                        },
                    ]
                );

            await somethingElse
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            boop : BigInt(2),
                        },
                        {
                            boop : BigInt(1),
                        },
                    ]
                );

            await tsql.from(somethingElse)
                .select(columns => [
                    columns.boop,
                    aliased.as("x"),
                ])
                .orderBy(columns => [
                    columns.somethingElse.boop.asc(),
                ])
                .fetchAll(connection)
                .then((results) => {
                    t.deepEqual(
                        results,
                        [
                            {
                                boop : BigInt(1),
                                x : true,
                            },
                            {
                                boop : BigInt(2),
                                x : false,
                            },
                        ]
                    );
                })
                .catch((err) => {
                    console.error(err);
                    console.error(err.sql);
                    t.fail(err.message);
                });
        });

        t.end();
    });
};
