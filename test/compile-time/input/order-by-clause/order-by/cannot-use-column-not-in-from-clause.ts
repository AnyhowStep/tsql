import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
import {FromClauseUtil} from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
    });

const otherTable = tsql.table("otherTable")
    .addColumns({
        otherColumn : tm.mysql.boolean(),
    });

tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.from(
        FromClauseUtil.newInstance(),
        myTable
    ),
    undefined,
    () => [
        tsql.and(
            otherTable.columns.otherColumn,
            false
        )
    ]
);

tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.from(
        FromClauseUtil.newInstance(),
        myTable
    ),
    undefined,
    () => [
        otherTable.columns.otherColumn
    ]
);
