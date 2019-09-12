import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";
import {UnionLimitBigInt} from "./union-limit-bigint";
import {UnionLimitNumber} from "./union-limit-number";
import {UnionLimitNumber0} from "./union-limit-number-0";
import {UnionLimitNumber1} from "./union-limit-number-1";
import {UnionLimitNumber0Or1} from "./union-limit-number-0-or-1";

export function unionLimit<
    QueryT extends IQuery,
    MaxRowCountT extends bigint
> (
    query : QueryT,
    maxRowCount : MaxRowCountT
) : (
    UnionLimitBigInt<QueryT, MaxRowCountT>
);
export function unionLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : 0
) : (
    UnionLimitNumber0<QueryT>
);
export function unionLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : 1
) : (
    UnionLimitNumber1<QueryT>
);
export function unionLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : 0|1
) : (
    UnionLimitNumber0Or1<QueryT>
);
export function unionLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : number|bigint
) : (
    UnionLimitNumber<QueryT>
);
export function unionLimit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : number|bigint
) : (
    | UnionLimitNumber0<QueryT>
    | UnionLimitNumber1<QueryT>
    | UnionLimitNumber0Or1<QueryT>
    | UnionLimitNumber<QueryT>
) {
    const unionLimitClause = LimitClauseUtil.limit<
        QueryT["unionLimitClause"]
    >(
        query.unionLimitClause,
        maxRowCount
    );

    const {
        fromClause,
        selectClause,

        limitClause,

        unionClause,
        //unionLimitClause,
    } = query;

    const result : UnionLimitNumber<QueryT> = new Query(
        {
            fromClause,
            selectClause,

            limitClause,

            unionClause,
            unionLimitClause,
        },
        query
    );
    return result;
}
