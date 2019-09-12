import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";
import {CompoundQueryLimitBigInt} from "./compound-query-limit-bigint";
import {CompoundQueryLimitNumber} from "./compound-query-limit-number";
import {CompoundQueryLimitNumber0} from "./compound-query-limit-number-0";
import {CompoundQueryLimitNumber1} from "./compound-query-limit-number-1";
import {CompoundQueryLimitNumber0Or1} from "./compound-query-limit-number-0-or-1";

export function compoundQueryLimit<
    QueryT extends IQuery,
    MaxRowCountT extends bigint
> (
    query : QueryT,
    maxRowCount : MaxRowCountT
) : (
    CompoundQueryLimitBigInt<QueryT, MaxRowCountT>
);
export function compoundQueryLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : 0
) : (
    CompoundQueryLimitNumber0<QueryT>
);
export function compoundQueryLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : 1
) : (
    CompoundQueryLimitNumber1<QueryT>
);
export function compoundQueryLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : 0|1
) : (
    CompoundQueryLimitNumber0Or1<QueryT>
);
export function compoundQueryLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : number|bigint
) : (
    CompoundQueryLimitNumber<QueryT>
);
export function compoundQueryLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : number|bigint
) : (
    | CompoundQueryLimitNumber0<QueryT>
    | CompoundQueryLimitNumber1<QueryT>
    | CompoundQueryLimitNumber0Or1<QueryT>
    | CompoundQueryLimitNumber<QueryT>
) {
    const compoundQueryLimitClause = LimitClauseUtil.limit<
        QueryT["compoundQueryLimitClause"]
    >(
        query.compoundQueryLimitClause,
        maxRowCount
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        //compoundQueryLimitClause,
    } = query;

    const result : CompoundQueryLimitNumber<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
        },
        query
    );
    return result;
}
