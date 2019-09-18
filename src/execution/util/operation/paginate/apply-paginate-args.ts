import {QueryBaseUtil, IQueryBase} from "../../../../query-base";
import {PaginateArgs, getPaginationStart} from "./paginate-args";
import {LimitClauseUtil} from "../../../../limit-clause";

export function applyPaginateArgs<
    QueryT extends QueryBaseUtil.AfterSelectClause & QueryBaseUtil.NonCorrelated
> (
    query : QueryT,
    args : PaginateArgs
) : (
    & Pick<
        QueryT,
        Exclude<keyof IQueryBase, "limitClause"|"compoundQueryLimitClause">
    >
    & Pick<IQueryBase, "limitClause"|"compoundQueryLimitClause">
) {
    const paginateLimitClause = LimitClauseUtil.offsetBigInt(
        LimitClauseUtil.limitBigInt(undefined, args.rowsPerPage),
        getPaginationStart(args)
    );

    if (query.compoundQueryClause == undefined) {
        return {
            ...query,
            limitClause : paginateLimitClause,
            compoundQueryLimitClause : undefined,
        };
    } else {
        return {
            ...query,
            compoundQueryLimitClause : paginateLimitClause,
        };
    }
}
