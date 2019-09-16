import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.bigIntUnsigned(),
    });

const other = tsql.table("other")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        otherVal : tm.mysql.bigIntUnsigned(),
    })
    .setPrimaryKey(columns => [columns.testId]);

export const p = tsql.ExecutionUtil.fetchAllUnmapped(
    tsql.from(test)
        .leftJoinUsingPrimaryKey(
            tables => tables.test,
            other
        )
        .select(columns => [
            columns.test,
            columns.other.otherVal,
        ])
        .orderBy(columns => [
            columns.test.testId.desc(),
        ]),
    null as any
);
