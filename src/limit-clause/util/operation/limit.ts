import {LimitClause} from "../../limit-clause";
import {LimitBigInt, limitBigInt} from "./limit-bigint";
import {LimitNumber0, LimitNumber1, LimitNumber0Or1, LimitNumber, limitNumber} from "./limit-number";

export function limit<
    LimitClauseT extends LimitClause|undefined,
    MaxRowCountT extends bigint
> (
    limitClause : LimitClauseT,
    maxRowCount : MaxRowCountT
) : (
    LimitBigInt<LimitClauseT, MaxRowCountT>
);
export function limit<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : 0
) : (
    LimitNumber0<LimitClauseT>
);
export function limit<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : 1
) : (
    LimitNumber1<LimitClauseT>
);
export function limit<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : 0|1
) : (
    LimitNumber0Or1<LimitClauseT>
);
export function limit<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : number
) : (
    LimitNumber<LimitClauseT>
);
export function limit<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : number|bigint
) : (
    LimitNumber<LimitClauseT>
);
export function limit (
    limitClause : LimitClause|undefined,
    maxRowCount : number|bigint
) : (
    LimitClause
) {
    if (typeof maxRowCount == "number") {
        return limitNumber(limitClause, maxRowCount);
    } else {
        return limitBigInt(limitClause, maxRowCount);
    }
}
