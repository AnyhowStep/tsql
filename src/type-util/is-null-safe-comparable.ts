import {IsComparable} from "./is-comparable";

/**
 * Implements `tsql`'s notion of **null-safe** comparability
 */
export type IsNullSafeComparable<T extends unknown, U extends unknown> = (
    IsComparable<
        Exclude<T, null>,
        Exclude<U, null>
    >
);
