import * as tm from "type-mapping";
import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            });

        const resultSet = await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "test",
                            columns : [
                                {
                                    columnAlias : "testId",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                },
                            ],
                        },
                    ]
                }
            );

            await test
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            testId : BigInt(1),
                            testVal : BigInt(100),
                        },
                        {
                            testId : BigInt(2),
                            testVal : BigInt(200),
                        },
                        {
                            testId : BigInt(3),
                            testVal : BigInt(300),
                        },
                        {
                            testId : BigInt(4),
                            testVal : BigInt(100),
                        },
                        {
                            testId : BigInt(5),
                            testVal : BigInt(200),
                        },
                        {
                            testId : BigInt(6),
                            testVal : BigInt(300),
                        },
                    ]
                );

            return tsql.from(test)
                .select(columns => [
                    tsql.integer.sumAsDecimal(columns.testId).as("sumId"),
                ])
                /**
                 * SQLite does not support `HAVING` with empty grouping set...
                 * @todo Forbid the `HAVING` clause with empty grouping set
                 */
                /*
                .having(columns => tsql.gt(
                    tsql.coalesce(
                        tsql.castAsDouble(
                            tsql.integer.sumAsDecimal(columns.testId)
                        ),
                        0.0
                    ),
                    6.0
                ))*/
                .fetchAll(
                    connection
                );
        });

        t.deepEqual(
            resultSet.map(
                row => ({
                    sumId : String(row.sumId),
                })
            ),
            [
                { sumId: "21.0", },
            ]
        );

        t.end();
    });
};
