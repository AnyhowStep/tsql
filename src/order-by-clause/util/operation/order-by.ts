import {IFromClause} from "../../../from-clause";
import {OrderByDelegate} from "../../order-by-delegate";
import {OrderByClause} from "../../order-by-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {allowedColumnRef, allowedNonAggregateColumnRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";
import {OrderUtil} from "../../../order";
import {ColumnUtil} from "../../../column";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {SelectClause} from "../../../select-clause";
import {BuiltInExprUtil} from "../../../built-in-expr";
import {GroupByClause} from "../../../group-by-clause";
import {RawOrder} from "../../../order";

/**
 * Returns the MySQL equivalent of `...orderBy, orderByDelegate(columns)`
 *
 * This will change when,
 * + The `ORDER BY` clause enforces proper `GROUP BY` interactions.
 *
 * -----
 *
 * @param fromClause
 * @param orderByClause
 * @param orderByDelegate
 */
export function orderBy<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause|undefined,
    SelectClauseT extends SelectClause|undefined
> (
    fromClause : FromClauseT,
    groupByClause : GroupByClauseT,
    selectClause : SelectClauseT,
    orderByClause : OrderByClause|undefined,
    orderByDelegate : OrderByDelegate<FromClauseT, GroupByClauseT, SelectClauseT>
) : (
    OrderByClause
) {
    const columns = allowedColumnRef(fromClause, selectClause);
    const orderBy = orderByDelegate(ColumnRefUtil.tryFlatten(
        columns
    )) as readonly RawOrder[];

    if (groupByClause == undefined) {
        for (const rawOrder of orderBy) {
            const sortExpr = OrderUtil.extractSortExpr(rawOrder);
            if (BuiltInExprUtil.isAggregate(sortExpr)) {
                throw new Error(`Aggregate expressions in ORDER BY clause not allowed without GROUP BY clause`);
            }
            if (ColumnUtil.isColumn(sortExpr)) {
                ColumnIdentifierRefUtil.assertHasColumnIdentifier(
                    columns,
                    sortExpr
                );
            } else {
                UsedRefUtil.assertAllowed(
                    { columns },
                    sortExpr.usedRef
                );
            }
        }
    } else {
        const nonAggregateColumns = allowedNonAggregateColumnRef(
            fromClause,
            groupByClause as Exclude<GroupByClauseT, undefined>,
            selectClause
        );
        for (const rawOrder of orderBy) {
            const sortExpr = OrderUtil.extractSortExpr(rawOrder);
            if (ColumnUtil.isColumn(sortExpr)) {
                ColumnIdentifierRefUtil.assertHasColumnIdentifier(
                    nonAggregateColumns,
                    sortExpr
                );
            } else {
                if (BuiltInExprUtil.isAggregate(sortExpr)) {
                    UsedRefUtil.assertAllowed(
                        { columns },
                        sortExpr.usedRef
                    );
                } else {
                    UsedRefUtil.assertAllowed(
                        { columns : nonAggregateColumns },
                        sortExpr.usedRef
                    );
                }
            }
        }
    }

    return (
        orderByClause == undefined ?
        orderBy.map(OrderUtil.fromRawOrder) :
        [...orderByClause, ...orderBy.map(OrderUtil.fromRawOrder)]
    );
}
