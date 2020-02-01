import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myColumn2 : tm.mysql.bigIntSigned(),
        stringColumn : tm.mysql.varChar(),
    });

tsql
    .from(myTable)
    .select(columns => [
        columns.myColumn,
    ])
    .orderBy(columns => [
        tsql.integer.max(columns.myColumn).asc(),
    ]);
