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

const fromClause = tsql.FromClauseUtil.from(
    tsql.FromClauseUtil.newInstance(),
    myTable
);

tsql.GroupByClauseUtil.groupBy(
    fromClause,
    undefined,
    undefined,
    () => [
        otherTable.columns.otherTableId,
        myTable.columns.createdAt,
    ]
);
