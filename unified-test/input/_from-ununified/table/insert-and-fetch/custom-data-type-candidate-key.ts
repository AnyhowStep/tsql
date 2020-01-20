import {Test} from "../../../../test";
import * as tsql from "../../../../../dist";
import {dtPoint} from "../../dt-point";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const test = tsql.table("test")
            .addColumns({
                testId : dtPoint,
                testVal : dtPoint,
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

            return test.insertAndFetch(
                connection,
                {
                    testId : {
                        x : 100,
                        y : 200,
                    },
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
                testId : {
                    x : 100,
                    y : 200,
                },
                testVal : {
                    x : 1,
                    y : 2,
                },
            }
        );

        await pool
            .acquire(async (connection) => {
                return test.fetchOneByCandidateKey(
                    connection,
                    {
                        testId : {
                            x : 100,
                            y : 200,
                        }
                    }
                );
            })
            .then((row) => {
                t.deepEqual(
                    row,
                    {
                        testId : {
                            x : 100,
                            y : 200,
                        },
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
