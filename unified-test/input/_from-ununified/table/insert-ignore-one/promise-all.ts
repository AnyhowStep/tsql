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
            .setAutoIncrement(columns => columns.testId);

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
                                autoIncrement : true,
                            },
                        }
                    ]
                }
            );

            function insertIgnoreOne () {
                return test.insertIgnoreOne(
                    connection,
                    {
                        testVal : BigInt(0),
                    }
                );
            }

            return Promise.all([
                insertIgnoreOne(),
                insertIgnoreOne(),
            ]).then((result) => {
                return result.map(r => r.autoIncrementId);
            }).catch((err) => {
                t.fail(String(err));
                return tsql.from(test)
                    .select(columns => [columns.testId])
                    .fetchValueArray(connection);
            });
        });
        t.deepEqual(
            insertResult,
            [
                BigInt(1),
                BigInt(2),
            ]
        );

        t.end();
    });
};
