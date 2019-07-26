import {ColumnIdentifier} from "../../column-identifier";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";

export function isColumnIdentifier (raw : unknown) : raw is ColumnIdentifier {
    if (!isObjectWithOwnEnumerableKeys<ColumnIdentifier>()(raw, [
        "tableAlias",
        "columnAlias"
    ])) {
        return false;
    }
    return (
        (typeof raw.tableAlias == "string") &&
        (typeof raw.columnAlias == "string")
    );
}
