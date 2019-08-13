/**
 * Implements `tsql`'s notion of comparability
 */
export type IsComparable<T extends unknown, U extends unknown> = (
    [T] extends [U] ?
    true :
    [U] extends [T] ?
    true :
    false
);
