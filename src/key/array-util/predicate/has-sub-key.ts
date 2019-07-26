import {Key} from "../../key";
import * as KeyUtil from "../../util";

export type HasSubKey<
    ArrT extends readonly Key[],
    KeyT extends Key
> = (
    true extends KeyUtil.IsSubKey<ArrT[number], KeyT> ?
    true :
    false
);
export function hasSubKey<
    ArrT extends readonly Key[],
    KeyT extends Key
> (
    arr : ArrT,
    key : KeyT
) : HasSubKey<ArrT, KeyT> {
    for (const k of arr) {
        if (KeyUtil.isSubKey(k, key)) {
            return true as HasSubKey<ArrT, KeyT>;
        }
    }
    return false as HasSubKey<ArrT, KeyT>;
}
