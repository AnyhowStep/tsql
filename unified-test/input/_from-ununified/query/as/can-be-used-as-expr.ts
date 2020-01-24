import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const myTable = tsql.table("myTable")
            .addColumns({
                myTableId : tm.mysql.bigIntUnsigned(),
            });

        const aliased = tsql.isNotNull(
            tsql
                .from(myTable)
                .select(c => [c.myTableId])
                .limit(1)
                .as("myAlias")
        );

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
                    ]
                }
            );

            await tsql.selectValue(() => aliased)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, false);
                });

            await myTable
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            myTableId : BigInt(9001),
                        },
                    ]
                );

            await tsql.selectValue(() => aliased)
                .fetchValue(connection)
                .then((value) => {
                    t.deepEqual(value, true);
                });

        });

        t.end();
    });
};
