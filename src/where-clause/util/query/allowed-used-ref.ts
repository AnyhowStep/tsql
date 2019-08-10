import {IFromClause, FromClauseUtil} from "../../../from-clause";

export type AllowedColumnRef<
    FromClauseT extends IFromClause
> = (
    FromClauseUtil.AllowedColumnRef<FromClauseT, { isLateral : true }>
);
export type AllowedUsedRef<
    FromClauseT extends IFromClause
> = (
    FromClauseUtil.AllowedUsedRef<FromClauseT, { isLateral : true }>
);
export function allowedColumnRef<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT
) : (
    AllowedColumnRef<FromClauseT>
) {
    return FromClauseUtil.allowedColumnRef(fromClause, { isLateral : true });
}

export function allowedUsedRef<
    FromClauseT extends IFromClause
> (
    fromClause : FromClauseT
) : (
    AllowedUsedRef<FromClauseT>
) {
    return FromClauseUtil.allowedUsedRef(fromClause, { isLateral : true });
}
