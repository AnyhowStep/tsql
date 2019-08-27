import * as tsql from "../../../../../dist";

export const limitClause = tsql.LimitClauseUtil.offset(
    {
        maxRowCount : 1337n,
        offset : 42n,
    } as const,
    9001n
);
