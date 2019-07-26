import {Key} from "../../key";
import * as KeyUtil from "../../util";

export type FindSuperKey<
    ArrT extends readonly Key[],
    KeyT extends Key
> = (
    KeyUtil.ExtractSuperKey<
        ArrT[number],
        KeyT
    >
);
export function findSuperKeys<
    ArrT extends readonly Key[],
    KeyT extends Key
>(arr : ArrT, key : KeyT) : FindSuperKey<ArrT, KeyT>[] {
    const result : Key[] = [];
    for (const k of arr) {
        if (KeyUtil.isSubKey(key, k)) {
            result.push(k);
        }
    }
    return result as FindSuperKey<ArrT, KeyT>[];
}
