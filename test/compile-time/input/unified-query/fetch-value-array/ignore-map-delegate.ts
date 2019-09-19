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
    .selectValue(columns => tsql.double.add(
        columns.test.testVal,
        columns.other.otherVal
    ))
    .orderBy(columns => [
        columns.test.testId.desc(),
    ])
    .map(() => undefined)
    .fetchValueArray(
        null as any
    );
