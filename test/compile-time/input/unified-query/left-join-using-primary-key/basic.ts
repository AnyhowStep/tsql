import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntUnsigned(),
        myOtherTableId : tm.mysql.bigIntUnsigned(),
    });

const myOtherTable = tsql.table("myOtherTable")
    .addColumns({
        myOtherTableId : tm.mysql.bigIntUnsigned(),
    })
    .setPrimaryKey(columns => [columns.myOtherTableId]);

export const query = tsql.QueryUtil.newInstance()
    .from(myTable)
    .leftJoinUsingPrimaryKey(
        tables => tables.myTable,
        myOtherTable
    );
