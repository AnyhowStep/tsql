import {Key} from "../../key";
import * as KeyUtil from "../../util";

/**
 * + Assumes `ArrT` may be a union
 *
 * Extracts a `Key` if it is in all `ArrT`
 */
export type ExtractKeysInCommon<ArrT extends readonly Key[]> = (
    KeyUtil.ExtractIfInKeyArray<ArrT[number], ArrT>
);
