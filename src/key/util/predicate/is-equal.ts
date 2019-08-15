import {Key} from "../../key";
import {isSubKey} from "./is-sub-key";

/**
 * Use this to check if `K0` is equal to **both** `K1` and `K2`
 * ```ts
 * type Result = IsEqual<K0, K1|K2> extends true ? "y" : "n"
 * ```
 *
 * -----
 *
 * Use this to check if `K0` is equal to **either** `K1` or `K2`
 * ```ts
 * type Result = true extends IsEqual<K0, K1|K2> ? "y" : "n"
 * ```
 */
export type IsEqual<
    A extends Key,
    B extends Key
> = (
    A extends Key ?
    (
        B extends Key ?
        (
            A[number] extends B[number] ?
            (
                B[number] extends A[number] ?
                true :
                false
            ) :
            false
        ) :
        never
    ) :
    never
);
export function isEqual (a : Key, b : Key) : boolean {
    return (
        isSubKey(a, b) &&
        isSubKey(b, a)
    );
}
