import {IColumn} from "../../column";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";
import { AstUtil } from "../../../ast";

export function isColumn (raw : unknown) : raw is IColumn {
    if (!isObjectWithOwnEnumerableKeys<IColumn>()(
        raw,
        [
            "tableAlias",
            "columnAlias",
            "mapper",
            "unaliasedAst",
        ]
    )) {
        return false;
    }
    return (
        (typeof raw.tableAlias == "string") &&
        (typeof raw.columnAlias == "string") &&
        (typeof raw.mapper == "function") &&
        (
            raw.unaliasedAst == undefined ||
            AstUtil.isAst(raw.unaliasedAst)
        )
    );
}