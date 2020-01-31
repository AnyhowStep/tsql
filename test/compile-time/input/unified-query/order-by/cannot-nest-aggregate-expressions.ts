import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myOtherColumn : tm.mysql.bigIntSigned(),
    });

tsql
    .from(myTable)
    .groupBy(columns => [
        columns.myTableId,
    ])
    .select(columns => [
        columns.myTableId,
        tsql.integer.max(
            columns.myColumn
        ).as("x"),
        tsql.integer.add(
            columns.myTableId
        ).as("y"),
    ])
    .orderBy((columns) => [
        tsql.isNotNull(columns.$aliased.x).asc(),
        tsql.isNotNull(columns.$aliased.y).asc(),
    ]);

tsql
    .from(myTable)
    .groupBy(columns => [
        columns.myTableId,
    ])
    .select(columns => [
        columns.myTableId,
        tsql.integer.max(
            columns.myColumn
        ).as("x"),
        tsql.integer.add(
            columns.myTableId
        ).as("y"),
    ])
    .orderBy((columns) => [
        tsql.integer.max(
            tsql.throwIfNull(columns.$aliased.x)
        ).asc(),
        tsql.integer.max(
            columns.$aliased.y
        ).asc(),
    ]);
