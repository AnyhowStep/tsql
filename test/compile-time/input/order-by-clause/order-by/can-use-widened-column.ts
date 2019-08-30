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

export const orderByClause = tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.from(
        FromClauseUtil.newInstance(),
        myTable
    ),
    undefined,
    () => [
        tsql.and3(
            myTableCopy.columns.myColumn,
            false
        ).desc()
    ]
);
