import {NonNullBuiltInValueExpr, BuiltInValueExprUtil} from "../../../built-in-value-expr";

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
    A extends unknown,
    B extends A
> = (
    [A] extends [NonNullBuiltInValueExpr] ?
    BuiltInValueExprUtil.CaseInsensitiveNarrow<A, B> :
    //Be conservative, do not narrow.
    //`B` could contain a string value.
    A extends unknown ?
    (
        B extends A ?
        A :
        never
    ) :
    never
);
