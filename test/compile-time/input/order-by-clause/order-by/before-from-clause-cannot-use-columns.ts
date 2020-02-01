import * as tm from "type-mapping/fluent";
import * as tsql from "../../../../../dist";
import {FromClauseUtil} from "../../../../../dist";

const myTable = tsql.table("myTable")
    .addColumns({
        myColumn : tm.mysql.boolean(),
    });

tsql.OrderByClauseUtil.orderBy(
    FromClauseUtil.newInstance(),
    undefined,
    undefined,
    undefined,
    () => [
        tsql.and(
            myTable.columns.myColumn,
            false
        )
    ]
);
