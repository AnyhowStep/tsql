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

tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.from(
        FromClauseUtil.newInstance(),
        myTable
    ),
    undefined,
    undefined,
    undefined,
    () => [
        tsql.and(
            myTableCopy.columns.myColumn,
            false
        )
    ]
);
