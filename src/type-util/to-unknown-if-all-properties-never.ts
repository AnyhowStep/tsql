import {CompileOk, CompileError} from "../compile-error";

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

export type ToUnknownIfCompileOk<CompileResult extends CompileOk|CompileError<any>> =
    [CompileResult] extends [CompileOk] ?
    unknown :
    Extract<CompileResult, CompileError<any>>
;
