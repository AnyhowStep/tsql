import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned().orNull(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .whereNullSafeEq(
        columns => columns.myTableId,
        1337n as 1337n|9001n
    );
export const query2 = query
    .whereNullSafeEq(
        columns => columns.myTableId,
        1337n
    );
