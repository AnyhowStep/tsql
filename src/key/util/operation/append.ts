import {Key} from "../../key";
import {removeDuplicates} from "./remove-duplicates";

export type Append<
    KeyT extends Key,
    StrT extends string
> = (
    readonly (
        KeyT[number] |
        StrT
    )[]
);

export function append<
    KeyT extends Key,
    StrT extends string
> (
    key : KeyT,
    str : StrT
) : (
    Append<KeyT, StrT>
) {
    return removeDuplicates([...key, str]);
}
