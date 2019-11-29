import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const dst = tsql.table("dst")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned().orNull(),
    })
    .setPrimaryKey(columns => [columns.testId])
    .addMutable(columns => [
        columns.testId,
        columns.testVal,
    ]);
export const p = dst.updateAndFetchOneBySuperKey(
    null as any,
    {
        testId : BigInt(1),
        testVal : BigInt(1),
    },
    () => {
        return {
            testId : BigInt(123456),
            testVal : tsql.ExprUtil.fromBuiltInExpr(BigInt(654321)),
        };
    }
);
