import {LimitClause} from "../../limit-clause";

/**
 * `PostgreSQL` supports the `LIMIT ALL` syntax.
 * https://www.postgresql.org/docs/8.0/queries-limit.html
 *
 * `MySQL` does not support the `LIMIT ALL` syntax.
 * So, we use the max `BIGINT UNSIGNED` value.
 *
 * When generating SQL strings, you may substitute `LIMIT 18446744073709551615`
 * with `LIMIT ALL` if your database supports it.
 */
export type ALL_ROW_COUNT = 18446744073709551615n;
export const ALL_ROW_COUNT : ALL_ROW_COUNT = BigInt(18446744073709551615) as ALL_ROW_COUNT;

export type Offset<
    LimitClauseT extends LimitClause|undefined,
    OffsetT extends bigint
> =
    LimitClauseT extends LimitClause ?
    {
        readonly maxRowCount : LimitClauseT["maxRowCount"],
        readonly offset : OffsetT,
    } :
    {
        readonly maxRowCount : ALL_ROW_COUNT,
        readonly offset : OffsetT,
    }
;

export function offset<
    LimitClauseT extends LimitClause|undefined,
    OffsetT extends bigint
> (
    limitClause : LimitClauseT,
    offset : OffsetT
) : (
    Offset<LimitClauseT, OffsetT>
) {
    if (limitClause == undefined) {
        return {
            maxRowCount : ALL_ROW_COUNT,
            offset,
        } as Offset<LimitClauseT, OffsetT>;
    } else {
        return {
            maxRowCount : limitClause.maxRowCount,
            offset,
        } as Offset<LimitClauseT, OffsetT>;
    }
}
