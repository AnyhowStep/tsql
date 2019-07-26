import {Key} from "../../key";
import {removeDuplicates} from "./remove-duplicates";

export type Remove<
    KeyT extends Key,
    StrT extends string
> = (
    readonly Exclude<KeyT[number], StrT>[]
);

export function remove<
    KeyT extends Key,
    StrT extends string
> (
    key : KeyT,
    str : StrT
) : (
    Remove<KeyT, StrT>
) {
    const result = removeDuplicates(
        key.filter(s => s != str)
    );
    return result as Remove<KeyT, StrT>;
}
