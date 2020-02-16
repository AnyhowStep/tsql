import {AnyBuiltInExpr} from "../../../built-in-expr";
import {ExprUtil} from "../../../expr";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {IColumn, ColumnUtil} from "../../../column";

export const SELECT_VALUE_ALIAS = "value";

export type ValueFromBuiltInExpr<BuiltInExprT extends AnyBuiltInExpr> =
    /**
     * We could use `BuiltInExprT extends IColumn|IExprSelectItem` but we won't.
     * This is intentional.
     *
     * The `IColumn|IExprSelectItem` may have different aliases and we want to be sure to check that.
     */
    [BuiltInExprT] extends [boolean] ?
    [
        ExprUtil.As<
            ExprUtil.FromBuiltInExpr<BuiltInExprT>,
            typeof SELECT_VALUE_ALIAS
        >
    ] :
    BuiltInExprT extends IColumn ?
    [BuiltInExprT] :
    BuiltInExprT extends IExprSelectItem ?
    [BuiltInExprT] :
    [
        ExprUtil.As<
            ExprUtil.FromBuiltInExpr<BuiltInExprT>,
            typeof SELECT_VALUE_ALIAS
        >
    ]
;
export function valueFromBuiltInExpr<
    BuiltInExprT extends AnyBuiltInExpr
> (
    builtInExpr : BuiltInExprT
) : (
    ValueFromBuiltInExpr<BuiltInExprT>
) {
    if (ColumnUtil.isColumn(builtInExpr) || ExprSelectItemUtil.isExprSelectItem(builtInExpr)) {
        return [builtInExpr] as ValueFromBuiltInExpr<BuiltInExprT>;
    } else {
        return [
            ExprUtil.as(
                ExprUtil.fromBuiltInExpr(builtInExpr),
                SELECT_VALUE_ALIAS
            )
        ] as ValueFromBuiltInExpr<BuiltInExprT>;
    }
}
