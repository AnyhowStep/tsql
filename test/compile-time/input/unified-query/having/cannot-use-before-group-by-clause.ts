import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
    });

tsql.QueryUtil.newInstance()
    .from(myTable)
    .having(() => tsql.and(
        myTable.columns.myColumn,
        false
    ));
