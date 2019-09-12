import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";
import {UnionOffsetBigInt} from "./union-offset-bigint";
import {UnionOffsetNumber} from "./union-offset-number";

export function unionOffset<
    QueryT extends IQuery,
    OffsetT extends bigint
> (
    query : QueryT,
    offset : OffsetT
) : (
    UnionOffsetBigInt<QueryT, OffsetT>
);
export function unionOffset<
    QueryT extends IQuery
> (
    query : QueryT,
    offset : number|bigint
) : (
    UnionOffsetNumber<QueryT>
);
export function unionOffset<
    QueryT extends IQuery
> (
    query : QueryT,
    offset : number|bigint
) : (
    UnionOffsetNumber<QueryT>
) {
    const unionLimitClause = LimitClauseUtil.offset<
        QueryT["unionLimitClause"]
    >(
        query.unionLimitClause,
        offset
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        compoundQueryClause,
        //unionLimitClause,
    } = query;

    const result : UnionOffsetNumber<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            unionLimitClause,
        },
        query
    );
    return result;
}
