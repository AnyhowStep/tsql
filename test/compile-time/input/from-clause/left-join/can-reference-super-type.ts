import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })

const myTableCopy = tsql.table("myTable")
    .addColumns({
        //Super-type
        myTableId : tm.mysql.bigIntSigned().orNull(),
    })

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    });

const nullSafeEq = tsql.nullSafeEq;

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

export const fromClause2 = tsql.FromClauseUtil.leftJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable,
    columns => nullSafeEq(
        columns.myTable.myTableId,
        columns.otherTable.otherTableId
    )
);
