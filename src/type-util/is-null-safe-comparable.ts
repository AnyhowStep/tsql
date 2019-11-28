import {IsComparable} from "./is-comparable";
import {BuiltInValueExpr} from "../built-in-value-expr";

/**
 * Implements `tsql`'s notion of **null-safe** comparability
 *
 * @todo Move this to `BuiltInValueExprUtil`
 */
export type IsNullSafeComparable<T extends BuiltInValueExpr, U extends BuiltInValueExpr> = (
    IsComparable<
        Exclude<T, null>,
        Exclude<U, null>
    >
);
