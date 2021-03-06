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
                .groupBy(columns => [
                    columns.testId,
                    columns.testVal,
                ])
                .select(columns => [
                    tsql.integer.sumAsDecimal(columns.testId).as("sumId"),
                    tsql.integer.integerDiv(columns.testVal, BigInt(2)).as("valDiv"),
                ])
                .orderBy(columns => [
                    columns.test.testVal.desc(),
                    columns.test.testId.asc(),
                ])
                .fetchAll(
                    connection
                );
        });

        t.deepEqual(
            resultSet.map(
                row => ({
                    sumId : String(row.sumId),
                    valDiv : row.valDiv,
                })
            ),
            [
                { sumId: "3.0", valDiv: BigInt(150) },
                { sumId: "6.0", valDiv: BigInt(150) },
                { sumId: "2.0", valDiv: BigInt(100) },
                { sumId: "5.0", valDiv: BigInt(100) },
                { sumId: "1.0", valDiv: BigInt(50) },
                { sumId: "4.0", valDiv: BigInt(50) },
            ]
        );

        t.end();
    });
};
