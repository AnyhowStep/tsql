import {PrimitiveExpr} from "../../primitive-expr";
import {PrimitiveType} from "../query";

/**
 * Assuming case-sensitive equality,
 * + You cannot narrow `Buffer` to a `Buffer-literal`
 *
 *   There is no `Buffer-literal` type
 *
 * + You cannot narrow `Date` to a `Date-literal`
 *
 *   There is no `Date-literal` type
 *
 */
export type NullSafeCaseSensitiveNarrow<
    A extends PrimitiveExpr,
    B extends A
> = (
    Extract<A, Buffer|Date> extends never ?
    B :
    PrimitiveType<B>
);
