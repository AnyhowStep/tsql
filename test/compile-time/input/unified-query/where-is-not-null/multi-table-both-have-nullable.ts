import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned().orNull(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableId : tm.mysql.bigIntUnsigned().orNull(),
    });

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .crossJoin(myOtherTable)
    .whereIsNotNull(
        columns => columns.myTable.myTableId
    );
