import {LimitClause} from "../../limit-clause";

export type Limit<
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

export function limit<
    LimitClauseT extends LimitClause|undefined,
    MaxRowCountT extends bigint
> (
    limitClause : LimitClauseT,
    maxRowCount : MaxRowCountT
) : (
    Limit<LimitClauseT, MaxRowCountT>
) {
    if (limitClause == undefined) {
        return {
            maxRowCount,
            offset : BigInt(0) as 0n,
        } as Limit<LimitClauseT, MaxRowCountT>;
    } else {
        return {
            maxRowCount,
            offset : limitClause.offset,
        } as Limit<LimitClauseT, MaxRowCountT>;
    }
}
