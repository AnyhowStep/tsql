import {isDate} from "../../../date-util";
import {PrimitiveExpr} from "../../primitive-expr";

export function isPrimitiveExpr (raw : unknown) : raw is PrimitiveExpr {
    switch (typeof raw) {
        case "bigint":
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
