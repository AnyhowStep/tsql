import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    })
    .setAutoIncrement(columns => columns.testId)
    .enableExplicitAutoIncrementValue();

export const p = tsql.ExecutionUtil.insertOne(
    test,
    null as any,
    {
        testId : tsql.ExprUtil.fromBuiltInExpr(BigInt(5)),
        testVal : BigInt(400),
    }
);
