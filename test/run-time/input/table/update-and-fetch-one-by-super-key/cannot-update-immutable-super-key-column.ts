import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {dtPoint} from "../../dt-point";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : dtPoint,
            testVal : dtPoint,
        })
        .setPrimaryKey(columns => [columns.testId])
        .addMutable(columns => [columns.testVal]);

    await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId TEXT PRIMARY KEY,
                testVal TEXT
            );
        `);

        await test.insertAndFetch(
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

        return test.updateAndFetchOneBySuperKey(
            connection,
            {
                testId : {
                    x : 100,
                    y : 200,
                },
            },
            () => {
                return {
                    testId : {
                        x : 111,
                        y : 222,
                    }
                } as any;
            }
        ).then(() => {
            t.fail("Should not be able to update candidate key");
        }).catch(() => {
            t.pass();
        });
    });

    await pool
        .acquire(async (connection) => {
            return test.fetchOneByCandidateKey(
                connection,
                {
                    testId : {
                        x : 100,
                        y : 200,
                    },
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

    await pool.disconnect();
    t.end();
});
