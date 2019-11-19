import {NonNullPrimitiveExpr} from "../../primitive-expr";
import {NonNullPrimitiveType} from "../query";

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
    A extends NonNullPrimitiveExpr,
    B extends A
> = (
    Extract<A, Uint8Array|Date> extends never ?
    B :
    NonNullPrimitiveType<B>
);
