import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    });

export const fromClause = tsql.FromClauseUtil.innerJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable,
    /**
     * This is allowed because it will internally be converted
     * to a non-aliased expression.
     *
     * This is allowed to make composing expressions more convenient
     */
    columns => tsql.eq(
        columns.myTable.myTableId,
        columns.otherTable.otherTableId
    ).as("aliasedExpr")
);
