import {NonNullBuiltInValueExpr} from "../../built-in-value-expr";
import {isBuiltInValueExpr} from "./is-built-in-value-expr";

export function isNonNullBuiltInValueExpr (raw : unknown) : raw is NonNullBuiltInValueExpr {
    if (raw === null) {
        return false;
    }
    return isBuiltInValueExpr(raw);
}
