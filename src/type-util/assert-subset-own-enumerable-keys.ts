import {CompileError} from "../compile-error";

/**
 * Asserts `A` has a subset of own enumerable keys as `B`.
 *
 * + Assumes `A` is not a union
 * + Assumes `B` is not a union
 */
export type AssertSubsetOwnEnumerableKeys<
    A,
    B
> =
    keyof A extends keyof B ?
    unknown :
    CompileError<[
        "Extra keys found",
        Exclude<keyof A, keyof B>
    ]>
;
