import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
    });

tsql
    .from(myTable)
    .crossJoin(otherTable)
    .groupBy(columns => [
        columns.myTable.myTableId,
    ])
    .select((columns) => [
        //Column
        columns.myTable.myTableId,
        //non-aggregate ExprSelectItem
        tsql.eq(1, 2).as("x"),
    ]);

tsql
    .from(myTable)
    .crossJoin(otherTable)
    .groupBy(columns => [
        columns.myTable.myTableId,
    ])
    .select((columns) => [
        //ColumnMap
        columns.myTable,
    ]);

tsql
    .from(myTable)
    .crossJoin(otherTable)
    .groupBy(columns => [
        columns.myTable.myTableId,
        columns.otherTable.myTableId,
    ])
    .select((columns) => [
        //ColumnRef
        columns,
    ]);
