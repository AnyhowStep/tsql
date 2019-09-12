import {ColumnRefUtil} from "../../../column-ref";
import {SelectClause} from "../../../select-clause";

/**
 * https://www.postgresql.org/docs/8.3/queries-order.html
 *
 * > ORDER BY can be applied to the result of a UNION, INTERSECT, or EXCEPT combination, but in this case
 * > it is only permitted to sort by output column names or numbers, not by expressions.
 *
 * -----
 *
 * PostgreSQL does not allow ordering by expressions in the `UNION ORDER BY` clause.
 * However, MySQL does.
 *
 * -----
 *
 * The workaround for PostgreSQL is to just...
 * Add the expressions you want to sort by in the `SELECT` clause.
 */
export type AllowedColumnRef<
    SelectClauseT extends SelectClause
> =
    ColumnRefUtil.FromSelectClause<SelectClauseT>
;
export function allowedColumnRef<
    SelectClauseT extends SelectClause
> (
    selectClause : SelectClauseT
) : (
    AllowedColumnRef<SelectClauseT>
) {
    const result = ColumnRefUtil.fromSelectClause(selectClause);
    return result as AllowedColumnRef<SelectClauseT>;
}
