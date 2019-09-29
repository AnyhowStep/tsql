import {NonNullEquatableType, CustomEquatableType} from "../../equatable-type";
import {BaseNonNullEquatableType} from "../query";
import {Decimal} from "../../../decimal";

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
 * + You cannot narrow `Decimal` to a `Decimal-literal`
 *
 *   There is no `Decimal-literal` type
 *
 */
export type CaseSensitiveNarrow<
    A extends NonNullEquatableType,
    B extends A
> = (
    Extract<A, Buffer|Date|Decimal|CustomEquatableType> extends never ?
    B :
    BaseNonNullEquatableType<B>
);
