/**
 * https://github.com/microsoft/TypeScript/issues/31992#issuecomment-503816806
 *
 * A hack to generate "better looking" types.
 */
type _<T> = T;
/**
 * Merges an intersection type into one object type.
 *
 * **DO NOT** pass union types into this type!
 */
export type Merge<T> = (
    _<{
        [k in keyof T] : T[k]
    }>
);