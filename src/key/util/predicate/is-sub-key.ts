import {Key} from "../../key";

export type IsSubKey<
    A extends Key,
    B extends Key
> = (
    A extends Key ?
    (
        B extends Key ?
        (
            A[number] extends B[number] ?
            true :
            false
        ) :
        never
    ) :
    never
);
export function isSubKey<
    A extends Key,
    B extends Key
> (
    a : A,
    b : B
) : IsSubKey<A, B> {
    return a.every(
        aKey => b.includes(aKey)
    ) as IsSubKey<A, B>;
}
