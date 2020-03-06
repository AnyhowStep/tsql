import {NonNullBuiltInValueExpr} from "../built-in-value-expr";
import {IsStrictSameType} from "./is-strict-same-type";
import {BaseType} from "./base-type";

export type IsNonNullBuiltInValueExprComparable<
    T extends NonNullBuiltInValueExpr,
    U extends NonNullBuiltInValueExpr
> =
    IsStrictSameType<
        BaseType<T>,
        BaseType<U>
    >
;

export type IsNullSafeComparableImpl<T extends unknown, U extends unknown> =
    [T] extends [NonNullBuiltInValueExpr] ?
    (
        [U] extends [NonNullBuiltInValueExpr] ?
        IsNonNullBuiltInValueExprComparable<T, U> :
        [T] extends [U] ?
        true :
        [U] extends [T] ?
        true :
        false
    ) :
    [T] extends [U] ?
    true :
    [U] extends [T] ?
    true :
    false
;

/**
 * Implements `tsql`'s notion of **null-safe** comparability
 */
export type IsNullSafeComparable<T extends unknown, U extends unknown> =
    IsNullSafeComparableImpl<
        Exclude<T, null>,
        Exclude<U, null>
    >
;
