import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned().orNull(),
                testVal : tm.mysql.bigIntUnsigned().orNull(),
            })
            .addCandidateKey(columns => [columns.testId]);

        const insertResult = await pool.acquire(async (connection) => {
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
                                    nullable : true,
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    nullable : true,
                                },
                            ],
                            candidateKeys : [
                                ["testId"]
                            ],
                        }
                    ]
                }
            );

            return test.insertMany(
                connection,
                [
                    {
                        testId : BigInt(1),
                        //testVal : BigInt(100),
                    },
                    {
                        //testId : BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(3),
                        testVal : BigInt(300),
                    },
                ]
            );
        });
        t.deepEqual(
            insertResult.insertedRowCount,
            BigInt(3)
        );
        t.deepEqual(
            insertResult.warningCount,
            BigInt(0)
        );

        await pool
            .acquire(async (connection) => {
                return tsql.from(test)
                    .select(columns => [columns])
                    .orderBy(columns => [
                        tsql.isNull(columns.testId).desc(),
                        columns.testId.asc(),
                    ])
                    .fetchAll(connection);
            })
            .then((rows) => {
                t.deepEqual(
                    rows,
                    [
                        {
                            testId : null,//BigInt(2),
                            testVal : BigInt(200),
                        },
                        {
                            testId : BigInt(1),
                            testVal : null,//BigInt(100),
                        },
                        {
                            testId : BigInt(3),
                            testVal : BigInt(300),
                        },
                    ]
                );
            });

        t.end();
    });
};
