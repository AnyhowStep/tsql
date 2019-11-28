import {NonNullBuiltInValueExpr} from "../../built-in-value-expr";
import {BaseNonNullBuiltInType} from "../query";

/**
 * Assuming case-insensitive equality,
 * + You cannot narrow `string` to a `string-literal`
 *
 *   Given`x = 'HeLlO'`,
 *   `x` could be `'hello'` or `'HELLO'`
 *
 * + You cannot narrow `Uint8Array` to a `Uint8Array-literal`
 *
 *   There is no `Uint8Array-literal` type
 *
 * + You cannot narrow `Date` to a `Date-literal`
 *
 *   There is no `Date-literal` type
 *
 */
export type CaseInsensitiveNarrow<
    A extends NonNullBuiltInValueExpr,
    B extends A
> = (
    Extract<A, string|Uint8Array|Date> extends never ?
    B :
    BaseNonNullBuiltInType<B>
);
