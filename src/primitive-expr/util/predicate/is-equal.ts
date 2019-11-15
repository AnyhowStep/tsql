import * as tm from "type-mapping";
import {PrimitiveExpr} from "../../primitive-expr";
import {isDate} from "../../../date-util";

export function isEqual (a : PrimitiveExpr, b : PrimitiveExpr) : boolean {
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

    if (Buffer.isBuffer(a)) {
        if (Buffer.isBuffer(b)) {
            return a.equals(b);
        } else {
            return false;
        }
    }

    /**
     * Use `strictEqual()` algorithm that handles `bigint` polyfill
     */
    return tm.TypeUtil.strictEqual(a, b);
}
