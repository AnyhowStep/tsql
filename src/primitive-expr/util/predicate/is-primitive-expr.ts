import * as tm from "type-mapping";
import {isDate} from "../../../date-util";
import {PrimitiveExpr} from "../../primitive-expr";

export function isPrimitiveExpr (raw : unknown) : raw is PrimitiveExpr {
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
    if (Buffer.isBuffer(raw)) {
        return true;
    }
    if (raw === null) {
        return true;
    }

    return false;
}
