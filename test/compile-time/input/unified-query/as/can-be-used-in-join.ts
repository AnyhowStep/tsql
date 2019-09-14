import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

export const aliased = tsql.QueryUtil.newInstance()
    .from(myTable)
    .select(c => [c.myTableId])
    .as("myAlias");

export const query = tsql.from(myTable)
    .crossJoin(aliased);
