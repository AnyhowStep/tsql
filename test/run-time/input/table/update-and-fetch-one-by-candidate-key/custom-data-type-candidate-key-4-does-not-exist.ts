import * as tape from "tape";
import * as tsql from "../../../../../dist";
import {Pool} from "../../sql-web-worker/promise.sql";
import {SqliteWorker} from "../../sql-web-worker/worker.sql";
import {dtPoint} from "../../dt-point";
import {RawExprUtil} from "../../../../../dist";

tape(__filename, async (t) => {
    const pool = new Pool(new SqliteWorker());

    const test = tsql.table("test")
        .addColumns({
            testId : dtPoint,
            testVal : dtPoint,
        })
        .addCandidateKey(columns => [columns.testId])
        .addAllMutable();

    await pool.acquire(async (connection) => {
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
            ArgT extends tsql.RawExpr<{ x:number, y:number }>,
            NewXT extends tsql.RawExpr<number>
        > (
            arg : ArgT,
            newX : NewXT
        ) {
            return tsql.expr(
                {
                    mapper : dtPoint,
                    usedRef : RawExprUtil.intersectUsedRef(arg, newX),
                },
                tsql.functionCall(
                    "replaceX",
                    [
                        RawExprUtil.buildAst(arg),
                        RawExprUtil.buildAst(newX),
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

        return test.updateAndFetchOneByCandidateKey(
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
        ).then(() => {
            t.fail("Should not be able to update row that does not exist");
        }).catch((err) => {
            t.true(err instanceof tsql.RowNotFoundError);
        });
    });

    t.end();
});
