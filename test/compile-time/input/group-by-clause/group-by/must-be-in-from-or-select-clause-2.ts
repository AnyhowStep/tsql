import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myTableId : tm.mysql.bigIntSigned(),
        createdAt : tm.mysql.dateTime(),
    })

const myTableCopy = tsql.table("myTable")
    .addColumns({
        createdAt2 : tm.mysql.dateTime(),
    })

const fromClause = tsql.FromClauseUtil.from(
    tsql.FromClauseUtil.newInstance(),
    myTable
);

tsql.GroupByClauseUtil.groupBy(
    fromClause,
    undefined,
    undefined,
    () => [
        myTableCopy.columns.createdAt2,
        myTable.columns.createdAt,
    ]
);
