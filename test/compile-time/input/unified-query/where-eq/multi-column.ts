import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
        otherColumn : tm.mysql.boolean(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEq(
        columns => columns.otherColumn,
        false
    ).whereEq(
        columns => columns.myTableId,
        1n
    );
