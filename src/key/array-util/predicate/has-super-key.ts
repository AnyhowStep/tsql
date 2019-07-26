import {Key} from "../../key";
import * as KeyUtil from "../../util";

export type HasSuperKey<
    ArrT extends readonly Key[],
    KeyT extends Key
> = (
    true extends KeyUtil.IsSubKey<KeyT, ArrT[number]> ?
    true :
    false
);
export function hasSuperKey<
    ArrT extends readonly Key[],
    KeyT extends Key
> (
    arr : ArrT,
    key : KeyT
) : HasSuperKey<ArrT, KeyT> {
    for (const k of arr) {
        if (KeyUtil.isSubKey(key, k)) {
            return true as HasSuperKey<ArrT, KeyT>;
        }
    }
    return false as HasSuperKey<ArrT, KeyT>;
}
