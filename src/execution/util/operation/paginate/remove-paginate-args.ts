import {QueryBaseUtil, IQueryBase} from "../../../../query-base";

export function removePaginateArgs<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
> (
    query : QueryT
) : (
    & Pick<
        QueryT,
        Exclude<keyof IQueryBase, "limitClause"|"compoundQueryLimitClause">
    >
    & Pick<IQueryBase, "limitClause"|"compoundQueryLimitClause">
) {
    if (query.compoundQueryClause == undefined) {
        return {
            ...query,
            limitClause : undefined,
            compoundQueryLimitClause : undefined,
        };
    } else {
        return {
            ...query,
            compoundQueryLimitClause : undefined,
        };
    }
}
