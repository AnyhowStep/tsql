import {NonNullBuiltInValueExpr, BuiltInValueExprUtil} from "../built-in-value-expr";

/**
 * Implements `tsql`'s notion of comparability.
 *
 * @todo Move this to `BuiltInValueExprUtil`
 */
export type IsComparable<T extends NonNullBuiltInValueExpr, U extends NonNullBuiltInValueExpr> = (
    [BuiltInValueExprUtil.BaseBuiltInType<T>] extends [BuiltInValueExprUtil.BaseBuiltInType<U>] ?
    (
        [BuiltInValueExprUtil.BaseBuiltInType<U>] extends [BuiltInValueExprUtil.BaseBuiltInType<T>] ?
        true :
        false
    ) :
    false
);
