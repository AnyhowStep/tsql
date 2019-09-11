import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereEq(
        columns => columns.myTableId,
        1337n as 1337n|9001n
    );
export const query2 = query
    .whereEq(
        columns => columns.myTableId,
        1337n
    );
