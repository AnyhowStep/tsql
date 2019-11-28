import {AnyBuiltInExpr} from "../../../raw-expr";
import {ExprUtil} from "../../../expr";
import {IExprSelectItem, ExprSelectItemUtil} from "../../../expr-select-item";
import {IColumn, ColumnUtil} from "../../../column";

export const SELECT_VALUE_ALIAS = "value";

export type ValueFromRawExpr<RawExprT extends AnyBuiltInExpr> =
    /**
     * We could use `RawExprT extends IColumn|IExprSelectItem` but we won't.
     * This is intentional.
     *
     * The `IColumn|IExprSelectItem` may have different aliases and we want to be sure to check that.
     */
    RawExprT extends IColumn ?
    [RawExprT] :
    RawExprT extends IExprSelectItem ?
    [RawExprT] :
    [
        ExprUtil.As<
            ExprUtil.FromRawExpr<RawExprT>,
            typeof SELECT_VALUE_ALIAS
        >
    ]
;
export function valueFromRawExpr<
    RawExprT extends AnyBuiltInExpr
> (
    rawExpr : RawExprT
) : (
    ValueFromRawExpr<RawExprT>
) {
    if (ColumnUtil.isColumn(rawExpr) || ExprSelectItemUtil.isExprSelectItem(rawExpr)) {
        return [rawExpr] as ValueFromRawExpr<RawExprT>;
    } else {
        return [
            ExprUtil.as(
                ExprUtil.fromRawExpr(rawExpr),
                SELECT_VALUE_ALIAS
            )
        ] as ValueFromRawExpr<RawExprT>;
    }
}
