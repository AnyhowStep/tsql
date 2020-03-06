import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.bigIntUnsigned(),
        myColumn2 : tm.mysql.bigIntUnsigned(),
    });

tsql.QueryUtil.newInstance()
    .from(myTable)
    .groupBy(columns => [
        columns.myColumn2,
    ])
    .having(columns => tsql.gt(
        tsql.coalesce(tsql.integer.sumAsDecimal(columns.myColumn), 0n),
        1n
    ));
