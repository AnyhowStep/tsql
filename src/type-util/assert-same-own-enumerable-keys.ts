import {CompileError} from "../compile-error";

/**
 * Asserts `A` has the same own enumerable keys as `B`.
 *
 * + Assumes `A` is not a union
 * + Assumes `B` is not a union
 */
export type AssertSameOwnEnumerableKeys<
    A,
    B
> = (
    keyof A extends keyof B ?
    (
        keyof B extends keyof A ?
        unknown :
        CompileError<[
            "Missing keys found",
            Exclude<keyof B, keyof A>
        ]>
    ) :
    CompileError<[
        "Extra keys found",
        Exclude<keyof A, keyof B>
    ]>
);

export function assertSameOwnEnumerableKeys (
    a : any,
    b : any
) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    const extraKeys = aKeys.filter(k => !bKeys.includes(k));
    const missingKeys = bKeys.filter(k => !aKeys.includes(k));

    if (extraKeys.length > 0) {
        if (missingKeys.length > 0) {
            throw new Error(`Extra keys found: ${extraKeys.join(",")}; Missing keys found: ${missingKeys.join(",")}`);
        } else {
            throw new Error(`Extra keys found: ${extraKeys.join(",")}`);
        }
    } else {
        if (missingKeys.length > 0) {
            throw new Error(`Missing keys found: ${missingKeys.join(",")}`);
        } else {
            //Do nothing
        }
    }
}
