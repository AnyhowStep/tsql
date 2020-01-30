import {IFromClause} from "../../../from-clause";
import {SelectDelegate} from "../../select-delegate";
import {SelectClause} from "../../select-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {allowedColumnRef} from "../query";
import {Concat} from "../../../tuple-util";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {IUsedRef} from "../../../used-ref";
import {assertValidUsedRef, assertValidColumnIdentifier, assertValidUsedRef_Aggregate, assertValidUsedRef_NonAggregate} from "../predicate";
import {GroupByClause} from "../../../group-by-clause";

/**
 * This reduces the lines of code emitted for the resulting
 * `SELECT` clause.
 *
 * Yes, emit times are a concern.
 */
type EraseUsedRef<
    SelectsT extends SelectClause
> =
    {
        [index in keyof SelectsT] : (
            SelectsT[index] extends IExprSelectItem ?
            IExprSelectItem<{
                mapper : SelectsT[index]["mapper"],
                tableAlias : SelectsT[index]["tableAlias"],
                alias : SelectsT[index]["alias"],
                usedRef : IUsedRef,
                isAggregate : SelectsT[index]["isAggregate"],
            }> :
            SelectsT[index]
        )
    }
;

export type Select<
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends SelectClause
> =
    SelectClauseT extends SelectClause ?
    Concat<
        SelectClauseT,
        EraseUsedRef<SelectsT>
    > :
    EraseUsedRef<SelectsT>
;

/**
 * Returns the MySQL equivalent of `...selectClause, ...selectClauseDelegate(fromClause)`
 *
 * @param fromClause
 * @param selectClause
 * @param selectDelegate
 *
 * @todo This should only be allowed **BEFORE** the `COMPOUND QUERY` clause.
 * If we `SELECT` after the `COMPOUND QUERY` clause, it'll change the number of columns, leading to bugs.
 */
export function select<
    FromClauseT extends IFromClause,
    GroupByClauseT extends GroupByClause|undefined,
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends SelectClause
> (
    fromClause : FromClauseT,
    groupByClause : GroupByClauseT,
    selectClause : SelectClauseT,
    selectDelegate : SelectDelegate<FromClauseT, GroupByClauseT, SelectClauseT, SelectsT>
) : (
    Select<
        SelectClauseT,
        SelectsT
    >
) {
    const columns = allowedColumnRef(fromClause);
    const selects = selectDelegate(ColumnRefUtil.tryFlatten(
        columns
    ));

    assertValidColumnIdentifier(selectClause, selects);

    if (groupByClause == undefined) {
        if (
            selects.some(selectItem => ExprSelectItemUtil.isExprSelectItem(selectItem) && selectItem.isAggregate) ||
            (
                selectClause != undefined &&
                selectClause.some(selectItem => ExprSelectItemUtil.isExprSelectItem(selectItem) && selectItem.isAggregate)
            )
        ) {
            assertValidUsedRef_Aggregate(fromClause, selects);
            assertValidUsedRef_NonAggregate(fromClause, [], selects);
        } else {
            assertValidUsedRef(fromClause, selects);
        }
    } else {
        assertValidUsedRef_Aggregate(fromClause, selects);
        assertValidUsedRef_NonAggregate(fromClause, groupByClause as Exclude<GroupByClauseT, undefined>, selects);
    }

    return (
        selectClause == undefined ?
        selects as Select<SelectClauseT, SelectsT> :
        [...(selectClause as SelectClause), ...selects] as Select<SelectClauseT, SelectsT>
    );
}
