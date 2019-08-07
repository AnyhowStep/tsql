import {IFromClause, FromClauseUtil} from "../../../from-clause";

export type AllowedUsedRef<
    FromClauseT extends IFromClause
> = (
    FromClauseUtil.AllowedUsedRef<FromClauseT, { isLateral : true }>
);
