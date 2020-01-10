import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {dtPoint} from "../../dt-point";
import {BuiltInExprUtil} from "../../../../../dist";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : dtPoint,
            testVal : dtPoint,
        })
        .setPrimaryKey(columns => [columns.testId])
        .addAllMutable();

    const result = await pool.acquire(async (connection) => {
        await connection.createFunction("replaceX", (pointStr, newX) => {
            if (typeof pointStr != "string") {
                throw new Error(`Expected string`);
            }
            const point = JSON.parse(pointStr);
            return JSON.stringify({
                ...point,
                x : newX,
            });
        });

        function replaceX<
            ArgT extends tsql.BuiltInExpr<{ x:number, y:number }>,
            NewXT extends tsql.BuiltInExpr<number>
        > (
            arg : ArgT,
            newX : NewXT
        ) {
            return tsql.expr(
                {
                    mapper : dtPoint,
                    usedRef : BuiltInExprUtil.intersectUsedRef(arg, newX),
                },
                tsql.functionCall(
                    "replaceX",
                    [
                        BuiltInExprUtil.buildAst(arg),
                        BuiltInExprUtil.buildAst(newX),
                    ]
                )
            );
        }

        await connection.exec(`
            CREATE TABLE test (
                testId TEXT PRIMARY KEY,
                testVal TEXT
            );
        `);

        return test.updateAndFetchZeroOrOneByPrimaryKey(
            connection,
            {
                testId : {
                    x : 100,
                    y : 200,
                },
            },
            (columns) => {
                return {
                    testId : replaceX(columns.testId, 1111),
                    testVal : replaceX(columns.testVal, 111),
                };
            }
        );
    });
    t.deepEqual(
        result.foundRowCount,
        BigInt(0)
    );
    t.deepEqual(
        result.updatedRowCount,
        BigInt(0)
    );
    t.deepEqual(
        result.warningCount,
        BigInt(0)
    );
    t.deepEqual(
        result.row,
        undefined
    );

    await pool.disconnect();
    t.end();
});
