import {EquatableType, CustomEquatableType} from "../../equatable-type";
import {BaseEquatableType} from "../query";
import {Decimal} from "../../../decimal";

/**
 * Assuming case-insensitive equality,
 * + You cannot narrow `string` to a `string-literal`
 *
 *   Given`x = 'HeLlO'`,
 *   `x` could be `'hello'` or `'HELLO'`
 *
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
export type NullSafeCaseInsensitiveNarrow<
    A extends EquatableType,
    B extends A|null
> = (
    Extract<A, string|Buffer|Date|Decimal|CustomEquatableType> extends never ?
    B :
    BaseEquatableType<B>
);
