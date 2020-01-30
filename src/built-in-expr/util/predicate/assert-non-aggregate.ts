import {AnyBuiltInExpr} from "../../built-in-expr";
import {isAggregate} from "../query";

export function assertNonAggregate (name : string, builtInExpr : AnyBuiltInExpr) {
    if (isAggregate(builtInExpr)) {
        throw new Error(`${name} must not be an aggregate expression`);
    }
}

export function assertAllNonAggregate (name : string, builtInExprArr : readonly AnyBuiltInExpr[]) {
    for (let i=0; i<builtInExprArr.length; ++i) {
        assertNonAggregate(`${name}[${i}]`, builtInExprArr[i]);
    }
}
