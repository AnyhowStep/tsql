import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    })
    .setAutoIncrement(columns => columns.testId)
    .enableExplicitAutoIncrementValue()
    .addExplicitDefaultValue(columns => [
        columns.testVal,
    ]);

export const p = test.insertAndFetch(
    null as any,
    {
        testId : 1n,
    }
);

export const p2 = test.insertAndFetch(
    null as any,
    {
        testId : 1n,
        testVal : 1n,
    }
);

export const p3 = test.insertAndFetch(
    null as any,
    {
        testVal : 1n,
    }
);
