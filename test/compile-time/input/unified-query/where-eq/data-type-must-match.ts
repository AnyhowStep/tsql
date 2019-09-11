import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
        otherColumn : tm.mysql.boolean(),
    });

tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEq(
        columns => columns.myTableId,
        true
    );

tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEq(
        columns => columns.otherColumn,
        1337n
    );
