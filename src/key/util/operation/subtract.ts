import {Key} from "../../key";
import {removeDuplicates} from "./remove-duplicates";

export type Subtract<
    A extends Key,
    B extends Key
> = (
    readonly Exclude<A[number], B[number]>[]
);

export function subtract<
    A extends Key,
    B extends Key
> (
    a : A,
    b : B
) : (
    Subtract<A, B>
) {
    const result = removeDuplicates(
        a.filter(s => !b.includes(s))
    );
    return result as Subtract<A, B>;
}
