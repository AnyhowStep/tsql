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
    let onRollbackInvoked = 0;
    pool.onInsertOne.addHandler((event) => {
        if (!event.isFor(test)) {
            return;
        }
        event.addOnCommitListener(() => {
            onCommitInvoked = true;
        });
        event.addOnRollbackListener(() => {
            ++onRollbackInvoked;
            throw new Error(`Blah`);
        });
        event.addOnRollbackListener(() => {
            ++onRollbackInvoked;
            throw new Error(`Blah`);
        });
        event.addOnRollbackListener(() => {
            ++onRollbackInvoked;
            throw new Error(`Blah`);
        });
        event.addOnRollbackListener(() => {
            ++onRollbackInvoked;
            throw new Error(`Blah`);
        });
        eventHandled = true;
        t.deepEqual(
            event.candidateKey,
            {
                testId : BigInt(4),
            }
        );

        throw new Error(`Sync throw`);
    });

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
                ]
            );

        t.deepEqual(eventHandled, false);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, 0);

        await connection.transaction(async (connection) => {
            t.deepEqual(eventHandled, false);
            t.deepEqual(onCommitInvoked, false);
            t.deepEqual(onRollbackInvoked, 0);

            /**
             * Should throw
             */
            await test.insertOne(
                connection,
                {
                    testId : BigInt(4),
                    testVal : BigInt(400),
                }
            );
        }).then(() => {
            t.fail("Should throw");
        }).catch((err) => {
            t.deepEqual(err.message, "Sync throw");
        });

        t.deepEqual(eventHandled, true);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, 4);
    });

    t.deepEqual(eventHandled, true);
    t.deepEqual(onCommitInvoked, false);
    t.deepEqual(onRollbackInvoked, 4);

    await pool
        .acquire(async (connection) => {
            return test.whereEqPrimaryKey({ testId : BigInt(4) }).fetchOne(connection)
                .orUndefined();
        })
        .then((row) => {
            t.deepEqual(
                row,
                undefined
            );
        });

    t.end();
});
};
