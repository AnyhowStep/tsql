import * as tsql from "../../../../../dist";
import {FromClauseUtil} from "../../../../../dist";

export const havingClause = tsql.HavingClauseUtil.having(
    FromClauseUtil.newInstance(),
    undefined,
    () => tsql.and3(
        null,
        false
    )
);
