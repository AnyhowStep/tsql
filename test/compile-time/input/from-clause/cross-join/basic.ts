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

export const fromClause = tsql.FromClauseUtil.crossJoin(
    tsql.FromClauseUtil.from(
        tsql.FromClauseUtil.newInstance(),
        myTable
    ),
    otherTable
);
