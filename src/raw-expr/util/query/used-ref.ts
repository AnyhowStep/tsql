import * as tm from "type-mapping";
import {AnyRawExpr} from "../../raw-expr";
import {BuiltInValueExpr, BuiltInValueExprUtil} from "../../../built-in-value-expr";
import {UsedRefUtil, IUsedRef} from "../../../used-ref";
import {ExprUtil} from "../../../expr";
import {IColumn, ColumnUtil} from "../../../column";
import {ExprSelectItemUtil} from "../../../expr-select-item";
import {IQueryBase, QueryBaseUtil} from "../../../query-base";

/**
 * Conditional types seem to reduce the amount of nesting allowed
 * before hitting the max instantiation depth.
 *
 * @todo Refactor this to not require conditional types?
 * Seems impossible.
 */
export type UsedRef<RawExprT extends AnyRawExpr|IQueryBase> = (
    /**
     * This implementation is the same as the implementation commented out below.
     * For some reason, this implementation is more efficient in terms of instantiation depth used.
     */
    | Extract<
        Exclude<
            RawExprT,
            (
                | BuiltInValueExpr
                | IColumn
                | IQueryBase
            )
        >["usedRef"],
        IUsedRef
    >
    | (
        RawExprT extends IColumn ?
        UsedRefUtil.FromColumn<RawExprT> :
        RawExprT extends IQueryBase ?
        UsedRefUtil.FromFromClause<RawExprT["fromClause"]> :
        RawExprT extends BuiltInValueExpr ?
        IUsedRef<{}> :
        never
    )
    /*RawExprT extends BuiltInValueExpr ?
    IUsedRef<{}> :
    RawExprT extends IExpr ?
    RawExprT["usedRef"] :
    RawExprT extends IColumn ?
    UsedRefUtil.FromColumn<RawExprT> :
    RawExprT extends IQueryBase ?
    UsedRefUtil.FromFromClause<RawExprT["fromClause"]> :
    RawExprT extends IExprSelectItem ?
    RawExprT["usedRef"] :
    never*/
);
export function usedRef<RawExprT extends AnyRawExpr|IQueryBase> (
    rawExpr : RawExprT
) : (
    UsedRef<RawExprT>
) {
    //Check built-in cases first
    if (BuiltInValueExprUtil.isBuiltInValueExpr(rawExpr)) {
        return UsedRefUtil.fromColumnRef({}) as UsedRef<RawExprT>;
    }

    if (ExprUtil.isExpr(rawExpr)) {
        return rawExpr.usedRef as UsedRef<RawExprT>;
    }

    if (ColumnUtil.isColumn(rawExpr)) {
        return UsedRefUtil.fromColumn(rawExpr) as UsedRef<RawExprT>;
    }

    if (QueryBaseUtil.isQuery(rawExpr)) {
        return UsedRefUtil.fromFromClause(rawExpr.fromClause) as UsedRef<RawExprT>;
    }

    if (ExprSelectItemUtil.isExprSelectItem(rawExpr)) {
        return rawExpr.usedRef as UsedRef<RawExprT>;
    }

    throw new Error(`Unknown rawExpr ${tm.TypeUtil.toTypeStr(rawExpr)}`);
}
