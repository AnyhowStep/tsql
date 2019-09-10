import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableId : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .innerJoin(myOtherTable, columns => tsql.isNotNull(
        columns.myTable.myTableId
    ));
