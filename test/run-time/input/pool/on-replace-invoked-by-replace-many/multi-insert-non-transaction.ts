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
    let onRollbackInvoked = false;
    pool.onReplace.addHandler(async (event) => {
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
            event.candidateKeys,
            [
                {
                    testId : BigInt(4),
                },
                {
                    testId : BigInt(6),
                },
                {
                    testId : BigInt(5),
                },
            ]
        );
        t.deepEqual(
            await event.getOrFetch(0),
            {
                testId : BigInt(4),
                testVal : BigInt(400),
            }
        );
        t.deepEqual(
            await event.getOrFetch(1),
            {
                testId : BigInt(6),
                testVal : BigInt(600),
            }
        );
        t.deepEqual(
            await event.getOrFetch(2),
            {
                testId : BigInt(5),
                testVal : BigInt(500),
            }
        );
    });

    const insertResult = await pool.acquire(async (connection) => {
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
        t.deepEqual(onRollbackInvoked, false);

        const result = await test.replaceMany(
            connection,
            [
                {
                    testId : BigInt(4),
                    testVal : BigInt(400),
                },
                {
                    testId : BigInt(6),
                    testVal : BigInt(600),
                },
                {
                    testId : BigInt(5),
                    testVal : BigInt(500),
                },
            ]
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
        insertResult.insertedOrReplacedRowCount,
        BigInt(3)
    );
    t.deepEqual(
        insertResult.warningCount,
        BigInt(0)
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
                    testVal : BigInt(400),
                }
            );
        });

    await pool
        .acquire(async (connection) => {
            return test.whereEqPrimaryKey({ testId : BigInt(5) }).fetchOne(connection);
        })
        .then((row) => {
            t.deepEqual(
                row,
                {
                    testId : BigInt(5),
                    testVal : BigInt(500),
                }
            );
        });

    await pool
        .acquire(async (connection) => {
            return test.whereEqPrimaryKey({ testId : BigInt(6) }).fetchOne(connection);
        })
        .then((row) => {
            t.deepEqual(
                row,
                {
                    testId : BigInt(6),
                    testVal : BigInt(600),
                }
            );
        });

    await pool.disconnect();t.end();
});
