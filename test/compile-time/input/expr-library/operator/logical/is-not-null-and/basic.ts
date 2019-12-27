import * as tm from "type-mapping";
import * as tsql from "../../../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned().orNull(),
    })
    .setPrimaryKey(columns => [columns.testId]);

export const expr = tsql.isNotNullAnd(
    test.columns.testVal,
    ({testVal}) => tsql.gt(
        testVal,
        BigInt(100)
    )
);
