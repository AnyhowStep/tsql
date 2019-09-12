import {IFromClause} from "../../../from-clause";
import {OrderByDelegate} from "../../order-by-delegate";
import {OrderByClause} from "../../order-by-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {allowedColumnRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";
import {OrderUtil} from "../../../order";
import {ColumnUtil} from "../../../column";
import {ColumnIdentifierRefUtil} from "../../../column-identifier-ref";
import {SelectClause} from "../../../select-clause";

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
    SelectClauseT extends SelectClause|undefined
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT,
    orderByClause : OrderByClause|undefined,
    orderByDelegate : OrderByDelegate<FromClauseT, SelectClauseT>
) : (
    OrderByClause
) {
    const columns = allowedColumnRef(fromClause, selectClause);
    const orderBy = orderByDelegate(ColumnRefUtil.tryFlatten(
        columns
    ));

    for (const rawOrder of orderBy) {
        const sortExpr = OrderUtil.extractSortExpr(rawOrder);
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

    return (
        orderByClause == undefined ?
        orderBy.map(OrderUtil.fromRawOrder) :
        [...orderByClause, ...orderBy.map(OrderUtil.fromRawOrder)]
    );
}
