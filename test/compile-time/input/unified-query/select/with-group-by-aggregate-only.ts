import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myColumn2 : tm.mysql.bigIntSigned(),
        stringColumn : tm.mysql.varChar(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        otherColumn : tm.mysql.bigIntSigned(),
    });

tsql
    .from(myTable)
    .crossJoin(otherTable)
    .groupBy(columns => [
        columns.myTable.myTableId,
    ])
    .select(() => [
        //aggregate ExprSelectItem, not referencing a column
        tsql.double.sum(1).as("x"),
    ]);

tsql
    .from(myTable)
    .crossJoin(otherTable)
    .groupBy(columns => [
        columns.myTable.myTableId,
    ])
    .select((columns) => [
        //aggregate ExprSelectItem, referencing a column
        tsql.integer.sumAsDecimal(columns.myTable.myTableId).as("x"),
    ]);
