import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    });

export const resultSet = tsql.from(test)
    .select(columns => [
        columns.testVal
    ])
    .orderBy(columns => [
        columns.testId.desc(),
    ])
    .fetchValueOr(
        null as any,
        "Hello, world"
    );
