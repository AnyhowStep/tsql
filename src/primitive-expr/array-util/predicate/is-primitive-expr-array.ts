import {PrimitiveExpr} from "../../primitive-expr";
import {isPrimitiveExpr} from "../../util/predicate/is-primitive-expr";

export function isPrimitiveExprArray (raw : unknown) : raw is PrimitiveExpr[] {
    if (!Array.isArray(raw)) {
        return false;
    }
    for (const item of raw) {
        if (!isPrimitiveExpr(item)) {
            return false;
        }
    }
    return true;
}
