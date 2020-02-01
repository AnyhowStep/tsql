import * as tsql from "../../../../../dist";
import {FromClauseUtil} from "../../../../../dist";

export const havingClause = tsql.HavingClauseUtil.having(
    FromClauseUtil.newInstance(),
    //It is technically impossible to have a GROUP BY clause without a FROM clause
    [null as unknown as tsql.IColumn<{ tableAlias : "t", columnAlias : "c", mapper : () => 1 }>],
    undefined,
    () => tsql.and3(
        null,
        false
    )
);
