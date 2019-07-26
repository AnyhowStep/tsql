import {Key} from "../../key";

export function removeDuplicates<KeyT extends Key> (
    key : KeyT
) : (
    readonly (KeyT[number])[]
) {
    const result : (KeyT[number])[] = [];
    for (const str of key) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }
    return result;
}
