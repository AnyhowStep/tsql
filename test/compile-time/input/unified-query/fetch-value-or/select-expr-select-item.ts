import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const test = tsql.table("test")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        testVal : tm.mysql.double(),
    });

const other = tsql.table("other")
    .addColumns({
        testId : tm.mysql.bigIntUnsigned(),
        otherVal : tm.mysql.double(),
    })
    .setPrimaryKey(columns => [columns.testId]);

export const resultSet = tsql.from(test)
    .innerJoinUsingPrimaryKey(
        tables => tables.test,
        other
    )
    .select(columns => [
        tsql.add(
            columns.test.testVal,
            columns.other.otherVal
        ).as("sum")
    ])
    .orderBy(columns => [
        columns.test.testId.desc(),
    ])
    .fetchValueOr(
        null as any,
        "Hello, world"
    );
