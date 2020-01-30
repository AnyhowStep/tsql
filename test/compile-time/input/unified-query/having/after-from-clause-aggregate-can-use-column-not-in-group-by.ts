import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.bigIntUnsigned(),
    });

tsql.QueryUtil.newInstance()
    .from(myTable)
    .having(columns => tsql.gt(
        tsql.coalesce(tsql.integer.sum(columns.myColumn), 0n),
        1n
    ));
