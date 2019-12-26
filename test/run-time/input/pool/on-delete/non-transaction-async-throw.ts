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
        .setPrimaryKey(columns => [columns.testId])
        .addAllMutable();

    let eventHandled = false;
    let onCommitInvoked = false;
    let onRollbackInvoked = false;
    pool.onDelete.addHandler(async (event) => {
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
            event.deleteResult.deletedRowCount,
            BigInt(1)
        );

        throw new Error(`Async throw`);
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
        t.deepEqual(onRollbackInvoked, false);

        await test.insertOne(
            connection,
            {
                testId : BigInt(4),
                testVal : BigInt(400),
            }
        );

        t.deepEqual(eventHandled, false);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);

        await test.delete(
            connection,
            () => tsql.eqPrimaryKey(
                test,
                {
                    testId : BigInt(4),
                }
            )
        ).then(() => {
            t.fail("Should throw");
        }).catch((err) => {
            t.deepEqual(err.message, "Async throw");
        });

        t.deepEqual(eventHandled, true);
        t.deepEqual(onCommitInvoked, false);
        t.deepEqual(onRollbackInvoked, false);

    });

    t.deepEqual(eventHandled, true);
    t.deepEqual(onCommitInvoked, true);
    t.deepEqual(onRollbackInvoked, false);

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
