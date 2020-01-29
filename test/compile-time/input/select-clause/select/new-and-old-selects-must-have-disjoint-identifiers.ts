import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned().orNull(),
    });

const fromClause = tsql.FromClauseUtil.crossJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable
);

export const selectClause = tsql.SelectClauseUtil.select(
    fromClause,
    undefined,
    undefined,
    columns => [
        columns.myTable.myTableId,
    ]
)

export const selectClause2 = tsql.SelectClauseUtil.select(
    fromClause,
    undefined,
    selectClause,
    columns => [
        columns.myTable.myTableId,
        columns.otherTable.otherTableId,
    ]
)
