import * as tm from "type-mapping";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    })

export const row = tsql.selectValue(() => 42)
    .from(myTable)
    .select(columns => [columns.myTableId])
    .fetchOneOrUndefined(
        null as any
    );
