import {NonNullPrimitiveExpr} from "../../primitive-expr";
import {NonNullPrimitiveType} from "../query";

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
export type CaseInsensitiveNarrow<
    A extends NonNullPrimitiveExpr,
    B extends A
> = (
    Extract<A, string|Buffer|Date> extends never ?
    B :
    NonNullPrimitiveType<B>
);
