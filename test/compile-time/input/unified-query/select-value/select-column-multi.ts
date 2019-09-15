import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
        myColumn2 : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql
    .from(myTable)
    .selectValue(columns => columns.myColumn2)
    .selectValue(columns => columns.myColumn);
