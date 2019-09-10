import * as tm from "type-mapping";
import {LimitClause} from "../../limit-clause";
import {OffsetBigInt, offsetBigInt} from "./offset-bigint";

export type OffsetNumber<
    LimitClauseT extends LimitClause|undefined
> =
    OffsetBigInt<LimitClauseT, bigint>
;

export function offsetNumber<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    offset : number
) : (
    OffsetNumber<LimitClauseT>
) {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    return offsetBigInt(
        limitClause,
        /**
         * Will throw a run-time error if `offset` is not an integer.
         */
        BigInt(offset)
    );
}
