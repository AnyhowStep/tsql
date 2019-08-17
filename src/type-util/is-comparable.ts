import {NonNullPrimitiveExpr, PrimitiveExprUtil} from "../primitive-expr";

/**
 * Implements `tsql`'s notion of comparability.
 *
 * @todo Move this to `PrimitiveExprUtil`
 */
export type IsComparable<T extends NonNullPrimitiveExpr, U extends NonNullPrimitiveExpr> = (
    [PrimitiveExprUtil.PrimitiveType<T>] extends [PrimitiveExprUtil.PrimitiveType<U>] ?
    (
        [PrimitiveExprUtil.PrimitiveType<U>] extends [PrimitiveExprUtil.PrimitiveType<T>] ?
        true :
        false
    ) :
    false
);
