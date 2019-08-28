import {LimitClause} from "../../limit-clause";
import {OffsetBigInt, offsetBigInt} from "./offset-bigint";
import {OffsetNumber, offsetNumber} from "./offset-number";

export function offset<
    LimitClauseT extends LimitClause|undefined,
    OffsetT extends bigint
> (
    limitClause : LimitClauseT,
    offset : OffsetT
) : (
    OffsetBigInt<LimitClauseT, OffsetT>
);
export function offset<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    offset : number
) : (
    OffsetNumber<LimitClauseT>
);
export function offset<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    offset : number|bigint
) : (
    OffsetNumber<LimitClauseT>
);
export function offset (
    limitClause : LimitClause|undefined,
    offset : number|bigint
) : (
    LimitClause
) {
    if (typeof offset == "number") {
        return offsetNumber(limitClause, offset);
    } else {
        return offsetBigInt(limitClause, offset);
    }
}
