import * as tsql from "../../../../../dist";

export const limitClause = tsql.LimitClauseUtil.limit(
    {
        maxRowCount : 1337n,
        offset : 42n,
    } as const,
    9001n
);
