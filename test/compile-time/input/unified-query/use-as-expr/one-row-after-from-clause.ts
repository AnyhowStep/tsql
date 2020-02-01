import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myColumn2 : tm.mysql.bigIntSigned(),
        stringColumn : tm.mysql.varChar(),
    });

export const expr = tsql.integer.add(
    tsql
        .from(myTable)
        .selectValue(columns => tsql.integer.max(
            columns.myTableId
        ))
        .coalesce(BigInt(0)),
    BigInt(2)
);

export const expr2 = tsql.isNotNull(
    tsql
        .from(myTable)
        .selectValue(columns => tsql.integer.max(
            columns.myTableId
        ))
);
