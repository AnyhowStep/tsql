import {NonNullBuiltInValueExpr} from "../../built-in-value-expr";
import {isNonNullBuiltInValueExpr} from "../../util/predicate/is-non-null-built-in-value-expr";

export function isNonNullBuiltInValueExprArray (raw : unknown) : raw is NonNullBuiltInValueExpr[] {
    if (!Array.isArray(raw)) {
        return false;
    }
    for (const item of raw) {
        if (!isNonNullBuiltInValueExpr(item)) {
            return false;
        }
    }
    return true;
}
