import {IsComparable} from "./is-comparable";
import {PrimitiveExpr} from "../primitive-expr";

/**
 * Implements `tsql`'s notion of **null-safe** comparability
 *
 * @todo Move this to `PrimitiveExprUtil`
 */
export type IsNullSafeComparable<T extends PrimitiveExpr, U extends PrimitiveExpr> = (
    IsComparable<
        Exclude<T, null>,
        Exclude<U, null>
    >
);
