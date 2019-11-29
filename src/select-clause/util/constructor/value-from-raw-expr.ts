import {AnyBuiltInExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {IColumn, ColumnUtil} from "../../../column";

export const SELECT_VALUE_ALIAS = "value";

export type ValueFromRawExpr<BuiltInExprT extends AnyBuiltInExpr> =
    /**
     * We could use `BuiltInExprT extends IColumn|IExprSelectItem` but we won't.
     * This is intentional.
     *
     * The `IColumn|IExprSelectItem` may have different aliases and we want to be sure to check that.
     */
    BuiltInExprT extends IColumn ?
    [BuiltInExprT] :
    BuiltInExprT extends IExprSelectItem ?
    [BuiltInExprT] :
    [
        ExprUtil.As<
            ExprUtil.FromRawExpr<BuiltInExprT>,
            typeof SELECT_VALUE_ALIAS
        >
    ]
;
export function valueFromRawExpr<
    BuiltInExprT extends AnyBuiltInExpr
> (
    rawExpr : BuiltInExprT
) : (
    ValueFromRawExpr<BuiltInExprT>
) {
    if (ColumnUtil.isColumn(rawExpr) || ExprSelectItemUtil.isExprSelectItem(rawExpr)) {
        return [rawExpr] as ValueFromRawExpr<BuiltInExprT>;
    } else {
        return [
            ExprUtil.as(
                ExprUtil.fromRawExpr(rawExpr),
                SELECT_VALUE_ALIAS
            )
        ] as ValueFromRawExpr<BuiltInExprT>;
    }
}
