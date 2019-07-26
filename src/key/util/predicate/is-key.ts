import {Key} from "../../key";

export function isKey (raw : any) : raw is Key {
    if (!(Array.isArray(raw))) {
        return false;
    }
    for (const item of raw) {
        if (typeof item != "string") {
            return false;
        }
    }
    return true;
}
