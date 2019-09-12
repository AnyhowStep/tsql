import {allowedColumnRef} from "../query";
import {SelectClause} from "../../../select-clause";
import {UnionOrderByClause} from "../../union-order-by-clause";
import {UnionOrderByDelegate} from "../../union-order-by-delegate";
import {ColumnRefUtil} from "../../../column-ref";
import {Concat} from "../../../tuple-util";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {OrderUtil} from "../../../order";

/**
 * This will probably never be used...
 */
export type UnionOrderBy<
    UnionOrderByClauseT extends UnionOrderByClause|undefined,
    UnionOrderByT extends UnionOrderByClause
> =
    UnionOrderByClauseT extends UnionOrderByClause ?
    Concat<
        UnionOrderByClauseT,
        UnionOrderByT
    > :
    UnionOrderByT
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
    compoundQueryOrderByClause : UnionOrderByClause|undefined,
    compoundQueryOrderByDelegate : UnionOrderByDelegate<SelectClauseT>
) : (
    UnionOrderByClause
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
