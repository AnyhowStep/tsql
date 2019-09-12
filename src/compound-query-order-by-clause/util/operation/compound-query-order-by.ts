import {allowedColumnRef} from "../query";
import {SelectClause} from "../../../select-clause";
import {CompoundQueryOrderByClause} from "../../compound-query-order-by-clause";
import {CompoundQueryOrderByDelegate} from "../../compound-query-order-by-delegate";
import {ColumnRefUtil} from "../../../column-ref";
import {Concat} from "../../../tuple-util";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {OrderUtil} from "../../../order";

/**
 * This will probably never be used...
 */
export type CompoundQueryOrderBy<
    CompoundQueryOrderByClauseT extends CompoundQueryOrderByClause|undefined,
    CompoundQueryOrderByT extends CompoundQueryOrderByClause
> =
    CompoundQueryOrderByClauseT extends CompoundQueryOrderByClause ?
    Concat<
        CompoundQueryOrderByClauseT,
        CompoundQueryOrderByT
    > :
    CompoundQueryOrderByT
;

/**
 * Returns the MySQL equivalent of `...compoundQueryOrderByClause, ...compoundQueryOrderByDelegate(columns)`
 *
 * @param selectClause
 * @param compoundQueryOrderByClause
 * @param compoundQueryOrderByDelegate
 */
export function compoundQueryOrderBy<
    /**
     * You can only `UNION ORDER BY` names in the `SELECT` clause.
     * So, it only makes sense to use this after the `SELECT` clause.
     */
    SelectClauseT extends SelectClause
> (
    selectClause : SelectClauseT,
    compoundQueryOrderByClause : CompoundQueryOrderByClause|undefined,
    compoundQueryOrderByDelegate : CompoundQueryOrderByDelegate<SelectClauseT>
) : (
    CompoundQueryOrderByClause
) {
    const columns = allowedColumnRef(selectClause);
    const compoundQueryOrderBy = compoundQueryOrderByDelegate(ColumnRefUtil.tryFlatten(
        columns
    ));

    for (const rawOrder of compoundQueryOrderBy) {
        const sortExpr = OrderUtil.extractSortExpr(rawOrder);
        ColumnIdentifierRefUtil.assertHasColumnIdentifier(
            columns,
            sortExpr
        );
    }

    return (
        compoundQueryOrderByClause == undefined ?
        compoundQueryOrderBy.map(OrderUtil.fromRawOrder) :
        [...compoundQueryOrderByClause, ...compoundQueryOrderBy.map(OrderUtil.fromRawOrder)]
    );
}
