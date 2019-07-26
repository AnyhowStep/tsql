import {Key} from "../../key";
import {removeDuplicates} from "./remove-duplicates";

export type Append<
    ArrT extends readonly Key[],
    KeyT extends Key
> = (
    readonly (
        ArrT[number] |
        KeyT
    )[]
);

export function append<
    ArrT extends readonly Key[],
    KeyT extends Key
> (
    arr : ArrT,
    key : KeyT
) : (
    Append<ArrT, KeyT>
) {
    return removeDuplicates([...arr, key]);
}
