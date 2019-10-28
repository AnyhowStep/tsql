import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    })
    .setPrimaryKey(columns => [columns.testId])
    .addExplicitDefaultValue(columns => [
        columns.testId,
        columns.testVal,
    ]);

export const p = test.insertAndFetch(
    null as any,
    {}
);
