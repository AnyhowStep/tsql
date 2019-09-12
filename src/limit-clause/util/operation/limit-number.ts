import * as tm from "type-mapping";
import {LimitClause} from "../../limit-clause";
import {LimitBigInt, limitBigInt} from "./limit-bigint";

export type LimitNumber0<
    LimitClauseT extends LimitClause|undefined
> =
    LimitBigInt<LimitClauseT, 0n>
;

export type LimitNumber1<
    LimitClauseT extends LimitClause|undefined
> =
    LimitBigInt<LimitClauseT, 1n>
;

export type LimitNumber0Or1<
    LimitClauseT extends LimitClause|undefined
> =
    LimitBigInt<LimitClauseT, 0n|1n>
;

export type LimitNumber<
    LimitClauseT extends LimitClause|undefined
> =
    LimitBigInt<LimitClauseT, bigint>
;

export function limitNumber<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : 0
) : (
    LimitNumber0<LimitClauseT>
);
export function limitNumber<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : 1
) : (
    LimitNumber1<LimitClauseT>
);
export function limitNumber<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : 0|1
) : (
    LimitNumber0Or1<LimitClauseT>
);
export function limitNumber<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : number
) : (
    LimitNumber<LimitClauseT>
);
export function limitNumber<
    LimitClauseT extends LimitClause|undefined
> (
    limitClause : LimitClauseT,
    maxRowCount : number
) : (
    | LimitNumber0<LimitClauseT>
    | LimitNumber1<LimitClauseT>
    | LimitNumber0Or1<LimitClauseT>
    | LimitNumber<LimitClauseT>
) {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    return limitBigInt(
        limitClause,
        /**
         * Will throw a run-time error if `maxRowCount` is not an integer.
         */
        BigInt(maxRowCount)
    );
}
