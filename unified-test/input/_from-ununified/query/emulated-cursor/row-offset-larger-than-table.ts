import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            });

        await pool.acquire(async (connection) => {
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
                            primaryKey : {
                                multiColumn : false,
                                columnAlias : "testId",
                                autoIncrement : false,
                            },
                        }
                    ]
                }
            );

            await test
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            testId : BigInt(6),
                            testVal : BigInt(600),
                        },
                        {
                            testId : BigInt(7),
                            testVal : BigInt(700),
                        },
                        {
                            testId : BigInt(3),
                            testVal : BigInt(300),
                        },
                        {
                            testId : BigInt(4),
                            testVal : BigInt(400),
                        },
                        {
                            testId : BigInt(8),
                            testVal : BigInt(800),
                        },
                        {
                            testId : BigInt(9),
                            testVal : BigInt(900),
                        },
                        {
                            testId : BigInt(1),
                            testVal : BigInt(100),
                        },
                        {
                            testId : BigInt(2),
                            testVal : BigInt(200),
                        },
                        {
                            testId : BigInt(5),
                            testVal : BigInt(500),
                        },
                    ]
                );

            const cursor = tsql.from(test)
                .orderBy(columns => [
                    columns.testId.asc(),
                ])
                .select(c => [c])
                .emulatedCursor(
                    connection,
                    {
                        rowsPerPage : 3,
                        rowOffset : 200,
                    }
                );
            let i = 0;
            for await (const row of cursor) {
                t.fail("Should not have anything to iterate over; " + JSON.stringify(row));
                ++i;
            }
            t.deepEqual(i, 0);
        });

        t.end();
    });
};
