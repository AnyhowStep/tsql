import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
import {FromClauseUtil} from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean().orNull(),
    });

const myTableCopy = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
    });

export const havingClause = tsql.HavingClauseUtil.having(
    FromClauseUtil.from(
        FromClauseUtil.newInstance(),
        myTable
    ),
    [myTableCopy.columns.myColumn],
    undefined,
    () => tsql.and(
        myTableCopy.columns.myColumn,
        false
    )
);
