import {CompileError} from "../compile-error";

/**
 * + `AssertNonNever<never, MessageT>` is `never`.
 * + `AssertNonNever<[never], MessageT>` is `CompileError<MessageT>`
 */
export type AssertNonNever<T extends [any], MessageT> =
    T[0] extends never ?
    CompileError<MessageT> :
    unknown
;
