import * as tm from "type-mapping";
import {Test} from "../../../test";
import * as tsql from "../../../../dist";

export const test : Test = ({tape, pool, createTemporarySchema}) => {
tape(__filename, async (t) => {
    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    let eventHandled = false;
    let onCommitInvoked = false;
    let onRollbackInvoked = false;
    pool.onInsertOne.addHandler((event) => {
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
            event.candidateKey,
            {
                testId : BigInt(4),
            }
        );
    });

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
                        } as const,
                    },
                ]
            }
        );

        await test
            .enableExplicitAutoIncrementValue()
            .insertMany(
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
                    {
                        testId : BigInt(4),
                        testVal : BigInt(444),
                    },
                ]
            );

        t.deepEqual(eventHandled, false);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);

        const result = await test.insertIgnoreOne(
            connection,
            {
                testId : BigInt(4),
                testVal : BigInt(400),
            }
        );

        t.deepEqual(eventHandled, false);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);

        return result;
    });

    t.deepEqual(eventHandled, false);
    t.deepEqual(onCommitInvoked, false);
    t.deepEqual(onRollbackInvoked, false);

    t.deepEqual(
        insertResult.insertedRowCount,
        BigInt(0)
    );
    t.deepEqual(
        insertResult.autoIncrementId,
        undefined
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(1)
    );

    await pool
        .acquire(async (connection) => {
            return test.whereEqPrimaryKey({ testId : BigInt(4) }).fetchOne(connection);
        })
        .then((row) => {
            t.deepEqual(
                row,
                {
                    testId : BigInt(4),
                    testVal : BigInt(444),
                }
            );
        });

    t.end();
});
};
