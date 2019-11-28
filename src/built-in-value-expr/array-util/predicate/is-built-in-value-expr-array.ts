import {BuiltInValueExpr} from "../../built-in-value-expr";
import {isBuiltInValueExpr} from "../../util/predicate/is-built-in-value-expr";

export function isBuiltInValueExprArray (raw : unknown) : raw is BuiltInValueExpr[] {
    if (!Array.isArray(raw)) {
        return false;
    }
    for (const item of raw) {
        if (!isBuiltInValueExpr(item)) {
            return false;
        }
    }
    return true;
}
