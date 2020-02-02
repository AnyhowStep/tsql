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
export const p = dst.whereEqSuperKey({
        testId : BigInt(1),
        testVal : BigInt(1),
    }).updateAndFetchOne(null as any, () => {
        return {
            testId : BigInt(123456),
            testVal : tsql.ExprUtil.fromBuiltInExpr(BigInt(654321)),
        };
    }
);
