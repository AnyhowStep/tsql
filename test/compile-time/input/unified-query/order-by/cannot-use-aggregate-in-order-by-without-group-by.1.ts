import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        myColumn : tm.mysql.bigIntSigned(),
        myColumn2 : tm.mysql.bigIntSigned(),
        stringColumn : tm.mysql.varChar(),
    });

/**
 * MySQL does not allow this, either.
 * You cannot `ORDER BY` an aggregate expression,
 * without a `GROUP BY` clause.
 */
tsql
    .from(myTable)
    .select(() => [
        tsql.integer.add(BigInt(1)).as("x"),
    ])
    .orderBy(columns => [
        tsql.integer.max(columns.myTable.myColumn).asc(),
    ]);

tsql
    .from(myTable)
    .select(() => [
        tsql.integer.add(BigInt(1)).as("x"),
    ])
    .orderBy(columns => [
        //This is allowed because there is no GROUP BY clause and this is not an aggregate expr
        columns.$aliased.x,
    ]);
