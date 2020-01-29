import {AnyBuiltInExpr} from "../../../built-in-expr";
import {IQueryBase} from "../../../query-base";
import {BuiltInExprUtil} from "../../../built-in-expr";

/**
 * Conditional types seem to reduce the amount of nesting allowed
 * before hitting the max instantiation depth.
 *
 * @todo Refactor this to not require conditional types?
 * Seems impossible.
 */
export type IsAggregate<CustomExprT extends unknown> =
    CustomExprT extends AnyBuiltInExpr|IQueryBase ?
    BuiltInExprUtil.IsAggregate<CustomExprT> :
    false
;

export function isAggregate<CustomExprT extends unknown> (
    customExpr : CustomExprT
) : (
    IsAggregate<CustomExprT>
) {
    if (BuiltInExprUtil.isBuiltInExpr(customExpr)) {
        return BuiltInExprUtil.isAggregate(customExpr) as IsAggregate<CustomExprT>;
    } else {
        return false as IsAggregate<CustomExprT>;
    }
}
