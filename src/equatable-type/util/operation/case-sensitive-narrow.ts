import {NonNullEquatableType, CustomEquatableType} from "../../equatable-type";
import {BaseNonNullEquatableType} from "../query";
import {Decimal} from "../../../decimal";

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
 * + You cannot narrow `Decimal` to a `Decimal-literal`
 *
 *   There is no `Decimal-literal` type
 *
 */
export type CaseSensitiveNarrow<
    A extends NonNullEquatableType,
    B extends A
> = (
    Extract<A, Uint8Array|Date|Decimal|CustomEquatableType> extends never ?
    B :
    BaseNonNullEquatableType<B>
);
