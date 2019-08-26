/**
 * If all properties are of type `never`, it returns `unknown`.
 * Otherwise, it returns a union of all property values.
 *
 * @todo Better name
 */
export type ToUnknownIfAllPropertiesNever<T> =
    T[keyof T] extends never ?
    unknown :
    T[keyof T]
;

export type ToNeverIfUnknown<T> =
    unknown extends T ?
    never :
    T
;
