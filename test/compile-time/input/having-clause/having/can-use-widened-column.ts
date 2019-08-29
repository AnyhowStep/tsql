import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
import {FromClauseUtil} from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
    });

const myTableCopy = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean().orNull(),
    });

export const havingClause = tsql.HavingClauseUtil.having(
    FromClauseUtil.from(
        FromClauseUtil.newInstance(),
        myTable
    ),
    undefined,
    () => tsql.isNotNull(
        tsql.and3(
            myTableCopy.columns.myColumn,
            false
        )
    )
);
