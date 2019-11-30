import {AnyBuiltInExpr} from "../../../built-in-expr";
import {UsedRefUtil, IUsedRef} from "../../../used-ref";
import {IQueryBase} from "../../../query-base";
import {BuiltInExprUtil} from "../../../built-in-expr";

/**
 * Conditional types seem to reduce the amount of nesting allowed
 * before hitting the max instantiation depth.
 *
 * @todo Refactor this to not require conditional types?
 * Seems impossible.
 */
export type UsedRef<CustomExprT extends unknown> =
    CustomExprT extends AnyBuiltInExpr|IQueryBase ?
    BuiltInExprUtil.UsedRef<CustomExprT> :
    IUsedRef<{}>
;

export function usedRef<CustomExprT extends unknown> (
    customExpr : CustomExprT
) : (
    UsedRef<CustomExprT>
) {
    if (BuiltInExprUtil.isBuiltInExpr(customExpr)) {
        return BuiltInExprUtil.usedRef(customExpr) as UsedRef<CustomExprT>;
    } else {
        return UsedRefUtil.fromColumnRef({}) as UsedRef<CustomExprT>;
    }
}
