import {LimitClauseUtil} from "../../../../limit-clause";
import {Query} from "../../../query-impl";
import {IQuery} from "../../../query";
import {LimitBigInt} from "./limit-bigint";
import {LimitNumber} from "./limit-number";
import {LimitNumber0} from "./limit-number-0";
import {LimitNumber1} from "./limit-number-1";
import {LimitNumber0Or1} from "./limit-number-0-or-1";

export function limit<
    QueryT extends IQuery,
    MaxRowCountT extends bigint
> (
    query : QueryT,
    maxRowCount : MaxRowCountT
) : (
    LimitBigInt<QueryT, MaxRowCountT>
);
export function limit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : 0
) : (
    LimitNumber0<QueryT>
);
export function limit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : 1
) : (
    LimitNumber1<QueryT>
);
export function limit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : 0|1
) : (
    LimitNumber0Or1<QueryT>
);
export function limit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : number|bigint
) : (
    LimitNumber<QueryT>
);
export function limit<
    QueryT extends IQuery
> (
    query : QueryT,
    maxRowCount : number|bigint
) : (
    LimitNumber<QueryT>
) {
    const limitClause = LimitClauseUtil.limit<
        QueryT["limitClause"]
    >(
        query.limitClause,
        maxRowCount
    );

    const {
        fromClause,
        selectClause,

        //limitClause,

        unionClause,
        unionLimitClause,
    } = query;

    const result : LimitNumber<QueryT> = new Query(
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
