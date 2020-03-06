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
        //aggregate no-ref
        tsql.double.sum(1).as("x"),
        //non-aggregate no-ref
        tsql.double.add(1, 2, 3).as("y"),
    ]);

tsql
    .from(myTable)
    .crossJoin(otherTable)
    .groupBy(columns => [
        columns.myTable.myTableId,
    ])
    .select((columns) => [
        //aggregate ref
        tsql.integer.sumAsDecimal(columns.myTable.myTableId).as("x"),
        //non-aggregate no-ref
        tsql.double.add(1, 2, 3).as("y"),
    ]);

tsql
    .from(myTable)
    .crossJoin(otherTable)
    .groupBy(columns => [
        columns.myTable.myTableId,
    ])
    .select((columns) => [
        //aggregate ref
        tsql.integer.sumAsDecimal(columns.myTable.myTableId).as("x"),
        //non-aggregate ref
        tsql.integer.add(columns.myTable.myTableId).as("y"),
    ]);
