import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : tm.mysql.bigIntUnsigned(),
        })
        .setPrimaryKey(columns => [columns.testId]);

    let eventHandled = false;
    let onCommitInvoked = false;
    let onRollbackInvoked = 0;
    pool.onReplace.addHandler((event) => {
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
            event.candidateKeys,
            [
                {
                    testId : BigInt(4),
                },
            ]
        );

        throw new Error(`Sync throw`);
    });

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal INT
            );
            INSERT INTO
                test(testId, testVal)
            VALUES
                (1, 100),
                (2, 200),
                (3, 300);
        `);

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
            await test.replaceOne(
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
            return test.fetchOneByPrimaryKey(connection, { testId : BigInt(4) })
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
