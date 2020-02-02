import * as tm from "type-mapping";
import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
    tape(__filename, async (t) => {
        const src = tsql.table("src")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        const test = tsql.table("test")
            .addColumns({
                testId : tm.mysql.bigIntUnsigned(),
                testVal : tm.mysql.bigIntUnsigned(),
            })
            .setPrimaryKey(columns => [columns.testId]);

        let eventHandled = false;
        let onCommitInvoked = false;
        let onRollbackInvoked = false;
        pool.onInsertSelect.addHandler((event) => {
            if (!event.isFor(test)) {
                return;
            }
            event.addOnCommitListener(() => {
                onCommitInvoked = true;
            });
            event.addOnRollbackListener(() => {
                onRollbackInvoked = true;
            });
            eventHandled = true;

            t.deepEqual(
                Object.keys(event.insertSelectRow),
                ["testId", "testVal"]
            );
        });

        const insertResult = await pool.acquire(async (connection) => {
            await createTemporarySchema(
                connection,
                {
                    tables : [
                        {
                            tableAlias : "src",
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
                            } as const,
                        },
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
                            } as const,
                        },
                    ]
                }
            );

            await src.insertMany(
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
                ]
            );

            await test.insertMany(
                connection,
                [
                    {
                        testId : BigInt(2),
                        testVal : BigInt(200),
                    },
                    {
                        testId : BigInt(4),
                        testVal : BigInt(400),
                    },
                ]
            );

            t.deepEqual(eventHandled, false);
            t.deepEqual(onCommitInvoked, false);
            t.deepEqual(onRollbackInvoked, false);

            const result = await tsql.from(src)
                .select(columns => [columns])
                .insertIgnore(
                    connection,
                    test,
                    columns => columns
                );

            t.deepEqual(eventHandled, true);
            t.deepEqual(onCommitInvoked, false);
            t.deepEqual(onRollbackInvoked, false);

            return result;
        });

        t.deepEqual(eventHandled, true);
        t.deepEqual(onCommitInvoked, true);
        t.deepEqual(onRollbackInvoked, false);

        t.deepEqual(
            insertResult.insertedRowCount,
            BigInt(2)
        );
        t.deepEqual(
            insertResult.warningCount,
            BigInt(1)
        );

        await pool
            .acquire(async (connection) => {
                return tsql.from(test)
                    .select(columns => [columns])
                    .orderBy(columns => [
                        columns.testId.desc(),
                    ])
                    .fetchAll(connection);
            })
            .then((rows) => {
                t.deepEqual(
                    rows,
                    [
                        {
                            testId : BigInt(4),
                            testVal : BigInt(400),
                        },
                        {
                            testId : BigInt(3),
                            testVal : BigInt(300),
                        },
                        {
                            testId : BigInt(2),
                            testVal : BigInt(200),
                        },
                        {
                            testId : BigInt(1),
                            testVal : BigInt(100),
                        },
                    ]
                );
            });

        t.end();
    });
};
