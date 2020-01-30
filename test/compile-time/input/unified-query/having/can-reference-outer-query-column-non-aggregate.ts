import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherColumn : tm.mysql.boolean(),
    });

export const query = tsql.requireOuterQueryJoins(otherTable)
    .from(myTable)
    .groupBy(columns => [
        columns.myColumn,
    ])
    .having(columns => tsql.eq(
        columns.myTable.myColumn,
        columns.otherTable.otherColumn
    ));
