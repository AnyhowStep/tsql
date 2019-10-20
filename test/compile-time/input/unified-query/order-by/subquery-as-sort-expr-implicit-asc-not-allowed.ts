import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myOtherColumn : tm.mysql.bigIntSigned(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        otherColumn : tm.mysql.bigIntSigned(),
    });

export const myQuery = tsql
    .from(myTable)
    .select(columns => [
        tsql.integer.add(
            columns.myColumn,
            32n
        ).as("x")
    ])
    .orderBy((_columns, subquery) => [
        //Unaliased subquery expression
        /*
            At the moment, this is not allowed
        */
        subquery
            .from(otherTable)
            .where(columns => tsql.eq(
                columns.myTable.myTableId,
                columns.otherTable.myTableId
            ))
            .limit(1)
            .select(columns => [columns.otherTable.otherColumn])
            //.asc(),
    ]);
