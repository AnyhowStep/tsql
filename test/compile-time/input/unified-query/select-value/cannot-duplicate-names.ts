import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
    });

tsql
    .from(myTable)
    .selectValue(columns => columns.myColumn)
    .selectValue(columns => columns.myColumn);
