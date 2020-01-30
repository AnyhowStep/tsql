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
    .select((columns) => [
        //Column
        columns.myTable.myTableId,
        //non-aggregate ExprSelectItem
        tsql.eq(1, 2).as("x"),
    ]);

tsql
    .from(myTable)
    .crossJoin(otherTable)
    .select((columns) => [
        //ColumnMap
        columns.myTable,
    ]);

tsql
    .from(myTable)
    .crossJoin(otherTable)
    .select((columns) => [
        //ColumnRef
        columns,
    ]);
