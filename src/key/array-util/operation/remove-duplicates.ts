import {Key} from "../../key";
import {hasKey} from "../predicate";
import * as KeyUtil from "../../util";

export function removeDuplicates<ArrT extends readonly Key[]> (
    arr : ArrT
) : (
    readonly (ArrT[number])[]
) {
    const result : Key[] = [];
    for (const key of arr) {
        if (!hasKey(result, key)) {
            result.push(KeyUtil.removeDuplicates(key));
        }
    }
    return result;
}
