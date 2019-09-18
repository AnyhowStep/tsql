import * as tm from "type-mapping";
import {LimitClause} from "../../limit-clause";

export type LimitBigInt<
    LimitClauseT extends LimitClause|undefined,
    MaxRowCountT extends bigint
> =
    LimitClauseT extends LimitClause ?
    {
        readonly maxRowCount : MaxRowCountT,
        readonly offset : LimitClauseT["offset"],
    } :
    {
        readonly maxRowCount : MaxRowCountT,
        readonly offset : 0n,
    }
;

export function limitBigInt<
    LimitClauseT extends LimitClause|undefined,
    MaxRowCountT extends bigint
> (
    limitClause : LimitClauseT,
    maxRowCount : MaxRowCountT
) : (
    LimitBigInt<LimitClauseT, MaxRowCountT>
) {
    const BigInt = tm.TypeUtil.getBigIntFactoryFunctionOrError();
    if (maxRowCount < 0) {
        throw new Error(`Cannot LIMIT fewer than zero rows`);
    }

    if (limitClause == undefined) {
        return {
            maxRowCount,
            offset : BigInt(0) as 0n,
        } as LimitBigInt<LimitClauseT, MaxRowCountT>;
    } else {
        return {
            maxRowCount,
            offset : limitClause.offset,
        } as LimitBigInt<LimitClauseT, MaxRowCountT>;
    }
}
