import * as tm from "type-mapping";
import {BuiltInValueExpr} from "../../built-in-value-expr";
import {isDate} from "../../../date-util";

export function isEqual (a : BuiltInValueExpr, b : BuiltInValueExpr) : boolean {
    if (a === b) {
        return true;
    }

    if (isDate(a)) {
        if (isDate(b)) {
            if (isNaN(a.getTime()) && isNaN(b.getTime())) {
                return true;
            }
            return a.getTime() === b.getTime();
        } else {
            return false;
        }
    }

    if (a instanceof Uint8Array) {
        if (b instanceof Uint8Array) {
            return tm.ArrayBufferUtil.equals(a, b);
        } else {
            return false;
        }
    }

    /**
     * Use `strictEqual()` algorithm that handles `bigint` polyfill
     */
    return tm.TypeUtil.strictEqual(a, b);
}
