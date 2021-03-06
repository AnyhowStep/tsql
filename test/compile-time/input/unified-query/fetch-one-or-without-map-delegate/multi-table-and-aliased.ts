import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    })

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntUnsigned(),
    })

export const row = tsql.selectValue(() => 42)
    .from(myTable)
    .select(columns => [columns.myTableId])
    .crossJoin(otherTable)
    .select(columns => [columns.otherTable.otherTableId])
    .fetchOneOr(
        null as any,
        "Hello, world"
    );
