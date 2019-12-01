import {BuiltInValueExprUtil, BuiltInValueExpr} from "../../../built-in-value-expr";

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
export type NullSafeCaseInsensitiveNarrow<
    A extends unknown,
    B extends A|null
> = (
    [A] extends [BuiltInValueExpr] ?
    BuiltInValueExprUtil.NullSafeCaseInsensitiveNarrow<A, B> :
    //Be conservative, do not narrow.
    //`B` could contain a string value.
    A extends unknown ?
    (
        B extends A ?
        A :
        /**
         * @todo Maybe `null extends B ? null : never`?
         *
         * Makes sense to make it "never" since if `A` is non-nullable,
         * then having `A <=> null` should always be false.
         */
        never
    ) :
    never
);
