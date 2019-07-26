import {Key} from "../../key";
import {isSubKey} from "./is-sub-key";

export function isEqual (a : Key, b : Key) : boolean {
    return (
        isSubKey(a, b) &&
        isSubKey(b, a)
    );
}
