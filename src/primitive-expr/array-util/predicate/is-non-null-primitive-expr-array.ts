import {NonNullPrimitiveExpr} from "../../primitive-expr";
import {isNonNullPrimitiveExpr} from "../../util/predicate/is-non-null-primitive-expr";

export function isNonNullPrimitiveExprArray (raw : unknown) : raw is NonNullPrimitiveExpr[] {
    if (!Array.isArray(raw)) {
        return false;
    }
    for (const item of raw) {
        if (!isNonNullPrimitiveExpr(item)) {
            return false;
        }
    }
    return true;
}
