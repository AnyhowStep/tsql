import {Key} from "../../key";
import * as KeyUtil from "../../util";

/**
 * + Assumes `ArrT` is not a union
 * + Assumes `KeyT` may be a union
 */
export type HasKey_NonUnion<
    ArrT extends readonly Key[],
    KeyT extends Key
>= (
    KeyT extends ArrT[number]?
    (
        Extract<ArrT[number], KeyT> extends never?
        false :
        true
    ) :
    false
);
/**
 * + Assumes `ArrT` may be a union
 * + Assumes `KeyT` may be a union
 */
export type HasKey<
    ArrT extends readonly Key[],
    KeyT extends Key
> = (
    ArrT extends readonly Key[] ?
    HasKey_NonUnion<ArrT, KeyT> :
    never
);
export function hasKey<
    ArrT extends readonly Key[],
    KeyT extends Key
> (
    arr : ArrT,
    key : KeyT
) : HasKey<ArrT, KeyT> {
    for (const k of arr) {
        if (KeyUtil.isEqual(k, key)) {
            return true as HasKey<ArrT, KeyT>;
        }
    }
    return false as HasKey<ArrT, KeyT>;
}
