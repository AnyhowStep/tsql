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

export const havingClause = tsql.HavingClauseUtil.having(
    FromClauseUtil.from(
        FromClauseUtil.newInstance(),
        myTable
    ),
    undefined,
    () => tsql.and(
        otherTable.columns.otherColumn,
        false
    )
);
