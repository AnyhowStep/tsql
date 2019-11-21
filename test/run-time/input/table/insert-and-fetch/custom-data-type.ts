import * as tm from "type-mapping";
import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {dtPoint} from "../../dt-point";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : tm.mysql.bigIntUnsigned(),
            testVal : dtPoint,
        })
        .setPrimaryKey(columns => [columns.testId]);

    const insertResult = await pool.acquire(async (connection) => {
        await connection.exec(`
            CREATE TABLE test (
                testId INT PRIMARY KEY,
                testVal TEXT
            );
        `);

        const customObj = await tsql
            .selectValue(() => tsql.expr(
                {
                    mapper : tm.unknown(),
                    usedRef : tsql.UsedRefUtil.fromColumnRef({}),
                },
                tsql.LiteralValueNodeUtil.stringLiteralNode(
                    JSON.stringify({
                        x : 1,
                        y : 2,
                    })
                )
            ))
            .fetchValue(connection);
        t.deepEqual(
            customObj,
            {
                x : 1,
                y : 2,
            }
        );

        return test.insertAndFetch(
            connection,
            {
                testId : BigInt(4),
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
            testId : BigInt(4),
            testVal : {
                x : 1,
                y : 2,
            },
        }
    );

    await pool
        .acquire(async (connection) => {
            return test.fetchOneByPrimaryKey(connection, { testId : BigInt(4) });
        })
        .then((row) => {
            t.deepEqual(
                row,
                {
                    testId : BigInt(4),
                    testVal : {
                        x : 1,
                        y : 2,
                    },
                }
            );
        });

    t.end();
});
