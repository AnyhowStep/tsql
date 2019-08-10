import * as tm from "type-mapping";
import {AnyRawExpr} from "../../raw-expr";
import {mapper} from "../query";

export function assertNonNull (name : string, rawExpr : AnyRawExpr) {
    if (tm.canOutputNull(mapper(rawExpr))) {
        throw new Error(`${name} must not be nullable`);
    }
}
