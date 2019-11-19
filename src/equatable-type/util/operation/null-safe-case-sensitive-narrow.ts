import {EquatableType, CustomEquatableType} from "../../equatable-type";
import {BaseEquatableType} from "../query";
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
export type NullSafeCaseSensitiveNarrow<
    A extends EquatableType,
    B extends A
> = (
    Extract<A, Uint8Array|Date|Decimal|CustomEquatableType> extends never ?
    B :
    BaseEquatableType<B>
);
