import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned().orNull(),
    })
    .setPrimaryKey(columns => [columns.testId]);

export const expr = tsql.ifIsNull(
    test.columns.testVal,
    test.columns.testId,
    ({testVal}) => tsql.integer.add(
        testVal,
        BigInt(100)
    )
);
