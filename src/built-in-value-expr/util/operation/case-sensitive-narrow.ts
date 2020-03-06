import {NonNullBuiltInValueExpr} from "../../built-in-value-expr";
import {BaseType} from "../../../type-util";

/**
 * Assuming case-sensitive equality,
 * + You cannot narrow `Uint8Array` to a `Uint8Array-literal`
 *
 *   There is no `Uint8Array-literal` type
 *
 * + You cannot narrow `Date` to a `Date-literal`
 *
 *   There is no `Date-literal` type
 *
 */
export type CaseSensitiveNarrow<
    A extends NonNullBuiltInValueExpr,
    B extends A
> = (
    Extract<A, Uint8Array|Date> extends never ?
    B :
    BaseType<B>
);
