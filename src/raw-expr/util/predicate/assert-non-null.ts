import * as tm from "type-mapping";
import {AnyBuiltInExpr} from "../../raw-expr";
import {mapper} from "../query";

export function assertNonNull (name : string, rawExpr : AnyBuiltInExpr) {
    if (tm.canOutputNull(mapper(rawExpr))) {
        throw new Error(`${name} must not be nullable`);
    }
}
