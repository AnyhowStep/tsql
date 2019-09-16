import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";
import {OffsetBigInt} from "./offset-bigint";
import {OffsetNumber} from "./offset-number";

export function offset<
    QueryT extends IQuery,
    OffsetT extends bigint
> (
    query : QueryT,
    offset : OffsetT
) : (
    OffsetBigInt<QueryT, OffsetT>
);
export function offset<
    QueryT extends IQuery
> (
    query : QueryT,
    offset : number|bigint
) : (
    OffsetNumber<QueryT>
);
export function offset<
    QueryT extends IQuery
> (
    query : QueryT,
    offset : number|bigint
) : (
    OffsetNumber<QueryT>
) {
    const limitClause = LimitClauseUtil.offset<
        QueryT["limitClause"]
    >(
        query.limitClause,
        offset
    );

    const {
        fromClause,
        selectClause,

        //limitClause,

        compoundQueryClause,
        compoundQueryLimitClause,
        mapDelegate,
    } = query;

    const result : OffsetNumber<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            compoundQueryClause,
            compoundQueryLimitClause,
            mapDelegate,
        },
        query
    );
    return result;
}
