import * as tm from "type-mapping";
import {LimitClause} from "../../limit-clause";

/**
 * `PostgreSQL` supports the `LIMIT ALL` syntax.
 * https://www.postgresql.org/docs/8.0/queries-limit.html
 *
 * -----
 *
 * SQLite does not support the `LIMIT ALL` syntax.
 *
 * The max integer value for SQLite is `9223372036854775807` (signed 8-byte int).
 * SQLite does not have `BIGINT UNSIGNED`.
 *
 * So, we use `LIMIT 9223372036854775807` for SQLite.
 *
 * -----
 *
 * `MySQL` does not support the `LIMIT ALL` syntax.
 * We **could** use the max `BIGINT UNSIGNED` value.
 *
 * But we want to be compatible with SQLite.
 *
 * So, instead of using  `LIMIT 18446744073709551615`,
 * we use SQLite's instead.
 */
export type ALL_ROW_COUNT = 9223372036854775807n;
export const ALL_ROW_COUNT : ALL_ROW_COUNT = tm.TypeUtil.getBigIntFactoryFunctionOrError()("9223372036854775807") as ALL_ROW_COUNT;

export type OffsetBigInt<
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

export function offsetBigInt<
    LimitClauseT extends LimitClause|undefined,
    OffsetT extends bigint
> (
    limitClause : LimitClauseT,
    offset : OffsetT
) : (
    OffsetBigInt<LimitClauseT, OffsetT>
) {
    if (offset < 0) {
        throw new Error(`Cannot OFFSET fewer than zero rows`);
    }

    if (limitClause == undefined) {
        return {
            maxRowCount : ALL_ROW_COUNT,
            offset,
        } as OffsetBigInt<LimitClauseT, OffsetT>;
    } else {
        return {
            maxRowCount : limitClause.maxRowCount,
            offset,
        } as OffsetBigInt<LimitClauseT, OffsetT>;
    }
}
