import {Key} from "../../key";
import * as KeyUtil from "../../util";

export function isKeyArray (raw : any) : raw is readonly Key[] {
    if (!Array.isArray(raw)) {
        return false;
    }
    for (const item of raw) {
        if (!KeyUtil.isKey(item)) {
            return false;
        }
    }
    return true;
}
