import * as tm from "type-mapping";
import {AnyBuiltInExpr} from "../../built-in-expr";
import {mapper, TypeOf} from "../query";
import {CompileError} from "../../../compile-error";

export type AssertNonNull<ExprT extends AnyBuiltInExpr> =
    null extends TypeOf<ExprT> ?
    CompileError<[
        "Expression must not be nullable",
        TypeOf<ExprT>
    ]> :
    unknown
;

/**
 * @todo Rename to `assertNonNullable`
 */
export function assertNonNull (name : string, builtInExpr : AnyBuiltInExpr) {
    if (tm.canOutputNull(mapper(builtInExpr))) {
        throw new Error(`${name} must not be nullable`);
    }
}
