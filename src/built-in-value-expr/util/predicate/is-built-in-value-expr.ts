import * as tm from "type-mapping";
import {isDate} from "../../../date-util";
import {BuiltInValueExpr} from "../../built-in-value-expr";

export function isBuiltInValueExpr (raw : unknown) : raw is BuiltInValueExpr {
    if (tm.TypeUtil.isBigInt(raw)) {
        return true;
    }
    switch (typeof raw) {
        case "number":
        case "string":
        case "boolean": {
            return true;
        }
    }
    if (isDate(raw)) {
        return true;
    }
    if (raw instanceof Uint8Array) {
        return true;
    }
    if (raw === null) {
        return true;
    }

    return false;
}
