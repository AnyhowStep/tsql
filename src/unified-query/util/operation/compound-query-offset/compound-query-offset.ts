import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";
import {CompoundQueryOffsetBigInt} from "./compound-query-offset-bigint";
import {CompoundQueryOffsetNumber} from "./compound-query-offset-number";

export function compoundQueryOffset<
    QueryT extends IQuery,
    OffsetT extends bigint
> (
    query : QueryT,
    offset : OffsetT
) : (
    CompoundQueryOffsetBigInt<QueryT, OffsetT>
);
export function compoundQueryOffset<
    QueryT extends IQuery
> (
    query : QueryT,
    offset : number|bigint
) : (
    CompoundQueryOffsetNumber<QueryT>
);
export function compoundQueryOffset<
    QueryT extends IQuery
> (
    query : QueryT,
    offset : number|bigint
) : (
    CompoundQueryOffsetNumber<QueryT>
) {
    const compoundQueryLimitClause = LimitClauseUtil.offset<
        QueryT["compoundQueryLimitClause"]
    >(
        query.compoundQueryLimitClause,
        offset
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        //compoundQueryLimitClause,
        mapDelegate,
        groupByClause,
    } = query;

    const result : CompoundQueryOffsetNumber<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
            groupByClause,
        },
        query
    );
    return result;
}
