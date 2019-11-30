import {IsNullSafeComparableImpl} from "./is-null-safe-comparable";

/**
 * Implements `tsql`'s notion of comparability.
 */
export type IsComparable<T extends unknown, U extends unknown> =
    null extends T ?
    false :
    null extends U ?
    false :
    IsNullSafeComparableImpl<T, U>
;
