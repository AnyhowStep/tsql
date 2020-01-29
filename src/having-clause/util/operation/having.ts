import {IFromClause} from "../../../from-clause";
import {HavingDelegate} from "../../having-delegate";
import {HavingClause} from "../../having-clause";
import {ColumnRefUtil} from "../../../column-ref";
import * as ExprLib from "../../../expr-library";
import {allowedColumnRef, allowedNonAggregateColumnRef} from "../query";
import {UsedRefUtil} from "../../../used-ref";
import {IAnonymousColumn} from "../../../column";
import {IAnonymousExpr, ExprUtil} from "../../../expr";
import {BuiltInExprUtil} from "../../../built-in-expr";
import {GroupByClause} from "../../../group-by-clause";

/**
 * Returns the MySQL equivalent of `havingClause AND havingDelegate(columns)`
 *
 * -----
 *
 * For now, this is basically the same as `WhereClauseUtil.where<>()`.
 *
 * They will diverge when,
 * + The `HAVING` clause enforces proper `GROUP BY` interactions.
 *
 * -----
 *
 * @param fromClause
 * @param havingClause
 * @param havingDelegate
 */
export function having<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause|undefined
> (
    fromClause : FromClauseT,
    groupByClause : GroupByClauseT,
    havingClause : HavingClause|undefined,
    havingDelegate : HavingDelegate<FromClauseT, GroupByClauseT>
) : (
    HavingClause
) {
    const columns = allowedColumnRef(fromClause);
    const operand : (
        boolean|IAnonymousColumn<boolean>|IAnonymousExpr<boolean, boolean>
    ) = havingDelegate(ColumnRefUtil.tryFlatten(
        columns
    ));

    if (BuiltInExprUtil.isAggregate(operand)) {
        UsedRefUtil.assertAllowed(
            { columns },
            BuiltInExprUtil.usedRef(operand)
        );
    } else {
        UsedRefUtil.assertAllowed(
            {
                columns : (
                    groupByClause == undefined ?
                    /**
                     * For the `HAVING` clause, we assume it's the empty grouping set.
                     */
                    allowedNonAggregateColumnRef(fromClause, []) :
                    allowedNonAggregateColumnRef(fromClause, groupByClause as Exclude<GroupByClauseT, undefined>)
                )
            },
            BuiltInExprUtil.usedRef(operand)
        );
    }

    return (
        havingClause == undefined ?
        ExprUtil.fromBuiltInExpr(operand) :
        ExprLib.and(havingClause, operand)
    );
}
