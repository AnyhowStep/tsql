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

export const fromClause = tsql.FromClauseUtil.leftJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable,
    columns => {
        return tsql.and(
            tsql.eq(
                columns.myTable.myTableId,
                columns.otherTable.otherTableId
            ),
            tsql.eq(
                columns.myTable.createdAt,
                columns.otherTable.createdAt
            )
        );
    }
);
