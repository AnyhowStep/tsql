import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
        myColumn2 : tm.mysql.bigIntUnsigned(),
    });

tsql.QueryUtil.newInstance()
    .from(myTable)
    .groupBy(columns => [
        columns.myColumn2,
    ])
    .having(columns => tsql.and(
        columns.myColumn,
        false
    ));

tsql.QueryUtil.newInstance()
    .from(myTable)
    .groupBy(columns => [
        columns.myColumn2,
    ])
    .having(columns => columns.myColumn);
