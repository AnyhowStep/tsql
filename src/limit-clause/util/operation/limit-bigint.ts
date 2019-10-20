import * as tm from "type-mapping";
import {LimitClause} from "../../limit-clause";
import {ALL_ROW_COUNT} from "./offset-bigint";

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
    if (tm.BigIntUtil.lessThan(maxRowCount, 0)) {
        throw new Error(`Cannot LIMIT fewer than zero rows`);
    }
    if (tm.BigIntUtil.greaterThan(maxRowCount, ALL_ROW_COUNT)) {
        throw new Error(`Cannot LIMIT more than ${ALL_ROW_COUNT} rows`);
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
