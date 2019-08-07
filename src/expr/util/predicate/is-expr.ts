import {IAnonymousExpr} from "../../expr";
import {isObjectWithOwnEnumerableKeys } from "../../../type-util";
//import {UsedRefUtil} from "../../../used-ref";
//import {AstUtil} from "../../../ast";

/**
 * Does not actually check,
 * + `x.usedRef` is `IUsedRef`
 * + `x.ast` is `Ast`
 *
 * @todo Consider adding checks for increased type safety.
 */
export function isExpr (x : unknown) : x is IAnonymousExpr<unknown> {
    if (!isObjectWithOwnEnumerableKeys<IAnonymousExpr<unknown>>()(
        x,
        [
            "mapper",
            "usedRef",
            "ast"
        ]
    )) {
        return false;
    }
    return (
        (typeof x.mapper == "function") //&&
        //UsedRefUtil.isUsedRef(x.usedRef) &&
        //AstUtil.isAst(x.ast)
    );
}
