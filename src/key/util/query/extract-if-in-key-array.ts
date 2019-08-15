import {Key} from "../../key";
import * as KeyArrayUtil from "../../array-util";

/**
 * + Assumes `ArrT` may be a union
 * + Assumes `KeyT` may be a union
 *
 * Extracts all `KeyT` that exist in all `ArrT`.
 *
 * If a given `KeyT` does not exist in some `ArrT`, it is not part of the result.
 */
export type ExtractIfInKeyArray<KeyT extends Key, ArrT extends readonly Key[]> = (
    KeyT extends Key ?
    (
        KeyArrayUtil.HasKey<ArrT, KeyT> extends true ?
        KeyT :
        never
    ) :
    never
);
