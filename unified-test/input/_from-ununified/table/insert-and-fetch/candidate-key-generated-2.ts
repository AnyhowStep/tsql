import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId])
            .addCandidateKey(columns => [columns.testVal])
            .addGenerated(columns => [columns.testId])
            .addExplicitDefaultValue(columns => [
                columns.testVal,
            ]);

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

            await test.insertAndFetch(
                connection,
                {
                    testId : BigInt(1),
                } as never
            ).then(() => {
                t.fail("Should not be able to insert anything");
            }).catch((err) => {
                t.true(tm.ErrorUtil.isMappingError(err));
            });

            await test.insertAndFetch(
                connection,
                {
                    testVal : BigInt(1),
                }
            );
        });

        await pool
            .acquire(async (connection) => {
                return tsql.from(test).select(columns => [columns]).fetchAll(connection);
            })
            .then((rows) => {
                t.deepEqual(
                    rows,
                    [
                        {
                            testId : BigInt(11),
                            testVal : BigInt(1),
                        }
                    ]
                );
            });

        t.end();
    });
};
