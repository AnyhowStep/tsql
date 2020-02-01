import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    });

tsql
    .from(test)
    .select(columns => [
        tsql.integer.sum(columns.testId).as("sumId"),
    ])
    .orderBy(columns => [
        columns.test.testVal,
    ]);
