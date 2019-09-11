import {PrimitiveExpr} from "../../primitive-expr";
import {PrimitiveType} from "../query";

/**
 * Assuming case-insensitive equality,
 * + You cannot narrow `string` to a `string-literal`
 *
 *   Given`x = 'HeLlO'`,
 *   `x` could be `'hello'` or `'HELLO'`
 *
 * + You cannot narrow `Buffer` to a `Buffer-literal`
 *
 *   There is no `Buffer-literal` type
 *
 * + You cannot narrow `Date` to a `Date-literal`
 *
 *   There is no `Date-literal` type
 *
 */
export type NullSafeCaseInsensitiveNarrow<
    A extends PrimitiveExpr,
    B extends A|null
> = (
    Extract<A, string|Buffer|Date> extends never ?
    B :
    PrimitiveType<B>
);
