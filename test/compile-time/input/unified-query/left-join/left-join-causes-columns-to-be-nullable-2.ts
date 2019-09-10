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

const yetAnotherTable = tsql.table("yetAnotherTable")
    .addColumns({
        yetAnotherTableId : tm.mysql.bigIntUnsigned(),
    });

export const query = tsql
    .from(myTable)
    .leftJoin(myOtherTable, columns => tsql.isNotNull(
        columns.myTable.myTableId
    ))
    .leftJoin(yetAnotherTable, columns => tsql.nullSafeEq(
        columns.myOtherTable.myOtherTableId,
        columns.yetAnotherTable.yetAnotherTableId
    ));
