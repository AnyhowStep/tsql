import {Key} from "../../key";
import * as KeyUtil from "../../util";

export function isDisjoint (
    arrayA : readonly Key[],
    arrayB : readonly Key[]
) : boolean {
    for (const a of arrayA) {
        for (const b of arrayB) {
            if (KeyUtil.isEqual(a, b)) {
                return false;
            }
        }
    }
    return true;
}
