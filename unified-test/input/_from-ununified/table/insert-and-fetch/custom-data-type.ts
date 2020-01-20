import * as tm from "type-mapping";
import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {dtPoint} from "../../dt-point";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : dtPoint,
            })
            .setPrimaryKey(columns => [columns.testId]);

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
                                        typeHint : tsql.TypeHint.STRING,
                                    },
                                },
                                {
                                    columnAlias : "testVal",
                                    dataType : {
                                        typeHint : tsql.TypeHint.STRING,
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

            /*
            const customObj = await tsql
                .selectValue(() => tsql.expr(
                    {
                        mapper : tm.unknown(),
                        usedRef : tsql.UsedRefUtil.fromColumnRef({}),
                    },
                    tsql.LiteralValueNodeUtil.stringLiteralNode(
                        JSON.stringify({
                            x : 1,
                            y : 2,
                        })
                    )
                ))
                .fetchValue(connection);
            t.deepEqual(
                customObj,
                {
                    x : 1,
                    y : 2,
                }
            );
            */

            return test.insertAndFetch(
                connection,
                {
                    testId : BigInt(4),
                    testVal : {
                        x : 1,
                        y : 2,
                    },
                }
            );
        });
        t.deepEqual(
            insertResult,
            {
                testId : BigInt(4),
                testVal : {
                    x : 1,
                    y : 2,
                },
            }
        );

        await pool
            .acquire(async (connection) => {
                return test.fetchOneByPrimaryKey(connection, { testId : BigInt(4) });
            })
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        testId : BigInt(4),
                        testVal : {
                            x : 1,
                            y : 2,
                        },
                    }
                );
            });

        t.end();
    });
};
