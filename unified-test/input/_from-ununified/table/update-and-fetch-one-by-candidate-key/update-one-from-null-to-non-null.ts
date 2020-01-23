import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const dst = tsql.table("dst")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned().orNull(),
            })
            .setPrimaryKey(columns => [columns.testId])
            .addMutable(columns => [
                columns.testVal,
            ]);

        const result = await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "dst",
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
                                    nullable : true,
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

            await dst
                .enableExplicitAutoIncrementValue()
                .insertMany(
                    connection,
                    [
                        {
                            testId : BigInt(1),
                            testVal : null,
                        },
                        {
                            testId : BigInt(2),
                            testVal : null,
                        },
                        {
                            testId : BigInt(3),
                            testVal : null,
                        },
                    ]
                );

            return dst
                .whereEqCandidateKey({
                    testId : BigInt(1),
                })
                .updateAndFetchOne(
                    connection,
                    columns => {
                        return {
                            testVal : tsql.integer.add(
                                tsql.coalesce(columns.testVal, BigInt(100)),
                                BigInt(50)
                            ),
                        };
                    }
                );
        });
        t.deepEqual(
            result.foundRowCount,
            BigInt(1)
        );
        t.deepEqual(
            result.updatedRowCount,
            BigInt(1)
        );
        t.deepEqual(
            result.warningCount,
            BigInt(0)
        );
        t.deepEqual(
            result.row,
            {
                testId : BigInt(1),
                testVal : BigInt(150),
            }
        );

        await pool
            .acquire(async (connection) => {
                return tsql.from(dst)
                    .select(columns => [columns])
                    .orderBy(columns => [
                        columns.testId.asc(),
                    ])
                    .fetchAll(connection);
            })
            .then((rows) => {
                t.deepEqual(
                    rows,
                    [
                        {
                            testId : BigInt(1),
                            testVal : BigInt(150),
                        },
                        {
                            testId : BigInt(2),
                            testVal : null,
                        },
                        {
                            testId : BigInt(3),
                            testVal : null,
                        },
                    ]
                );
            });

        t.end();
    });
};
