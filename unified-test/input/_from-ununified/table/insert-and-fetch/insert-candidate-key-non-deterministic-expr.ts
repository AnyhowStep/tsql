import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tsql.dtBigIntSigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .addCandidateKey(columns => [columns.testId])
            .addExplicitDefaultValue(columns => [
                columns.testId,
                columns.testVal,
            ]);

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
                                    default : BigInt(11),
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.BIGINT_SIGNED,
                                    },
                                    default : BigInt(11),
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

            return (test).insertAndFetch(
                connection,
                {
                    testId : tsql.integer.randomBigIntSigned(),
                    testVal : BigInt(400),
                }
            );
        });
        t.true(
            tm.TypeUtil.isBigInt(insertResult.testId)
        );
        t.deepEqual(
            insertResult.testVal,
            BigInt(400)
        );

        await pool
            .acquire(async (connection) => {
                return tsql.from(test).select(columns => [columns]).fetchAll(connection);
            })
            .then((rows) => {
                t.deepEqual(
                    rows,
                    [
                        {
                            testId : insertResult.testId,
                            testVal : BigInt(400),
                        }
                    ]
                );
            });

        t.end();
    });
};
