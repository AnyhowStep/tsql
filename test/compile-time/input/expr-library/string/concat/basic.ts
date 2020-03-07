import * as tm from "type-mapping";
import * as tsql from "../../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.varChar(),
    })
    .setPrimaryKey(columns => [columns.testId]);

export const expr = tsql.concat(
    "hello, ",
    test.columns.testVal,
).as("greetings");
