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

            function insertAndFetch () {
                return test.insertAndFetch(
                    connection,
                    {
                        testId : tsql.integer.add(
                            tsql.from(test)
                                .selectValue(columns => tsql.integer.max(columns.testId))
                                .limit(1)
                                .coalesce(BigInt(0)),
                            BigInt(1)
                        ),
                        testVal : BigInt(0),
                    }
                );
            }

            return Promise.all([
                insertAndFetch(),
                insertAndFetch(),
            ]).catch((err) => {
                t.fail(String(err));
                return tsql.from(test)
                    .select(columns => [columns])
                    .fetchAll(connection);
            });
        });
        t.deepEqual(
            insertResult,
            [
                {
                    testId  : BigInt(1),
                    testVal : BigInt(0),
                },
                {
                    testId  : BigInt(2),
                    testVal : BigInt(0),
                },
            ]
        );

        t.end();
    });
};
