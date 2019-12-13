import {Key} from "../../key";
import {removeDuplicates} from "./remove-duplicates";

export type Concat<
    A extends Key,
    B extends Key
> = (
    readonly (
        A[number] |
        B[number]
    )[]
);

export type ConcatDistribute<
    A extends Key,
    B extends Key
> = (
    A extends Key ?
    (
        B extends Key ?
        readonly (
            A[number] |
            B[number]
        )[] :
        never
    ) :
    never
);

export function concat<
    A extends Key,
    B extends Key
> (
    a : A,
    b : B
) : (
    Concat<A, B>
) {
    return removeDuplicates([...a, ...b]);
}
