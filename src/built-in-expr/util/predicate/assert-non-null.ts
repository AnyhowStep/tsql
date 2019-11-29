import * as tm from "type-mapping";
import {AnyBuiltInExpr} from "../../built-in-expr";
import {mapper} from "../query";

/**
 * @todo Rename to `assertNonNullable`
 */
export function assertNonNull (name : string, builtInExpr : AnyBuiltInExpr) {
    if (tm.canOutputNull(mapper(builtInExpr))) {
        throw new Error(`${name} must not be nullable`);
    }
}
