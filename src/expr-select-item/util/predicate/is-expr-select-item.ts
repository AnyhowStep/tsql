import {IAnonymousExprSelectItem} from "../../expr-select-item";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";
//import {UsedRefUtil} from "../../../used-ref";
//import {AstUtil} from "../../../ast";

/**
 * Does not actually check,
 * + `x.usedRef` is `IUsedRef`
 * + `x.unaliasedAst` is `Ast`
 *
 * @todo Consider adding checks for increased type safety.
 */
export function isExprSelectItem (x : unknown) : x is IAnonymousExprSelectItem<unknown, boolean> {
    if (!isObjectWithOwnEnumerableKeys<IAnonymousExprSelectItem<unknown, boolean>>()(
        x,
        [
            "mapper",
            "tableAlias",
            "alias",
            "usedRef",
            "isAggregate",
            "unaliasedAst",
        ]
    )) {
        return false;
    }
    return (
        (typeof x.mapper == "function") &&
        (typeof x.tableAlias == "string") &&
        (typeof x.alias == "string") //&&
        //UsedRefUtil.isUsedRef(x.usedRef) &&
        //(typeof x.isAggregate == "boolean") &&
        //AstUtil.isAst(x.ast)
    );
}
