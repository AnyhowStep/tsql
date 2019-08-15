import {NonNullPrimitiveExpr} from "../primitive-expr";

/**
 * Implements `tsql`'s notion of comparability.
 *
 * @todo Move this to `PrimitiveExprUtil`
 */
export type IsComparable<T extends NonNullPrimitiveExpr, U extends NonNullPrimitiveExpr> = (
    [T] extends [U] ?
    (
        [U] extends [T] ?
        true :
        false
    ) :
    false
);
