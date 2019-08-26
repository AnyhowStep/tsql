import {IFromClause} from "../../../from-clause";
import {SelectDelegate} from "../../select-delegate";
import {SelectClause} from "../../select-clause";
import {ColumnRefUtil} from "../../../column-ref";
import {allowedColumnRef} from "../query";
import {SelectItem} from "../../../select-item";
import {Concat} from "../../../tuple-util";
import {IExprSelectItem} from "../../../expr-select-item";
import {IUsedRef} from "../../../used-ref";

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
                usedRef : IUsedRef
            }> :
            SelectsT[index]
        )
    }
;

export type Select<
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends readonly SelectItem[]
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
 */
export function select<
    FromClauseT extends IFromClause,
    SelectClauseT extends SelectClause|undefined,
    SelectsT extends readonly SelectItem[]
> (
    fromClause : FromClauseT,
    selectClause : SelectClauseT,
    selectDelegate : SelectDelegate<FromClauseT, SelectClauseT, SelectsT>
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
    /**
     * @todo
     */
    if (Math.random() < 9999) {
        throw new Error(`Not implemented`)
    }
/*
    UsedRefUtil.assertAllowed(
        { columns },
        selects.usedRef
    );
*/
    return (
        selectClause == undefined ?
        selects as Select<SelectClauseT, SelectsT> :
        [...(selectClause as SelectClause), ...selects] as Select<SelectClauseT, SelectsT>
    );
}
