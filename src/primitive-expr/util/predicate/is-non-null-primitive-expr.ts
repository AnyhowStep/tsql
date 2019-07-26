import {NonNullPrimitiveExpr} from "../../primitive-expr";
import {isPrimitiveExpr} from "./is-primitive-expr";

export function isNonNullPrimitiveExpr (raw : unknown) : raw is NonNullPrimitiveExpr {
    if (raw === null) {
        return false;
    }
    return isPrimitiveExpr(raw);
}
