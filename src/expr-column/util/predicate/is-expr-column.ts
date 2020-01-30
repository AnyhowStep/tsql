import {IExprColumn} from "../../expr-column";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";
import {AstUtil} from "../../../ast";

export function isExprColumn (raw : unknown) : raw is IExprColumn {
    if (!isObjectWithOwnEnumerableKeys<IExprColumn>()(
        raw,
        [
            "tableAlias",
            "columnAlias",
            "mapper",
            "isAggregate",
            "unaliasedAst",
        ]
    )) {
        return false;
    }
    return (
        (typeof raw.tableAlias == "string") &&
        (typeof raw.columnAlias == "string") &&
        (typeof raw.mapper == "function") &&
        (typeof raw.isAggregate == "boolean") &&
        (
            raw.unaliasedAst == undefined ||
            AstUtil.isAst(raw.unaliasedAst)
        )
    );
}
