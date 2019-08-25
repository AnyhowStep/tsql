import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned().orNull(),
        createdAt : tm.mysql.dateTime(),
    })

const myTableCopy = tsql.table("myTable")
    .addColumns({
        //Strict subtype
        myTableId : tm.mysql.bigIntSigned(),
    })

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    });

    const nullSafeEq = tsql.makeNullSafeComparison("<=>");

export const fromClause = tsql.FromClauseUtil.leftJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable,
    columns => nullSafeEq(
        myTableCopy.columns.myTableId,
        columns.otherTable.otherTableId
    )
);
