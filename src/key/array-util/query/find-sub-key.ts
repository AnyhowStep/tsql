import {Key} from "../../key";
import * as KeyUtil from "../../util";

export type FindSubKey<
    ArrT extends readonly Key[],
    KeyT extends Key
> = (
    KeyUtil.ExtractSubKey<
        ArrT[number],
        KeyT
    >
);
export function findSubKeys<
    ArrT extends readonly Key[],
    KeyT extends Key
>(arr : ArrT, key : KeyT) : FindSubKey<ArrT, KeyT>[] {
    const result : Key[] = [];
    for (const k of arr) {
        if (KeyUtil.isSubKey(k, key)) {
            result.push(k);
        }
    }
    return result as FindSubKey<ArrT, KeyT>[];
}
