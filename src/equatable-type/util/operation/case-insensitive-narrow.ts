import {NonNullEquatableType, CustomEquatableType} from "../../equatable-type";
import {BaseNonNullEquatableType} from "../query";
import {Decimal} from "../../../decimal";

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
 * + You cannot narrow `Decimal` to a `Decimal-literal`
 *
 *   There is no `Decimal-literal` type
 *
 */
export type CaseInsensitiveNarrow<
    A extends NonNullEquatableType,
    B extends A
> = (
    Extract<A, string|Uint8Array|Date|Decimal|CustomEquatableType> extends never ?
    B :
    BaseNonNullEquatableType<B>
);
