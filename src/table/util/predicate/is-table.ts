import {ITable} from "../../table";
import {isObjectWithOwnEnumerableKeys} from "../../../type-util";

/**
 * Actually only checks if it has all the properties of `ITable`.
 *
 * So, if it has all the properties but they're of the wrong data type...
 */
export function isTable (mixed : unknown) : mixed is ITable {
    return isObjectWithOwnEnumerableKeys<ITable>()(
        mixed,
        [
            "isLateral",
            "alias",
            "columns",
            "usedRef",
            "unaliasedAst",
            "autoIncrement",
            "id",
            "primaryKey",
            "candidateKeys",
            "insertEnabled",
            "deleteEnabled",
            "generatedColumns",
            "nullableColumns",
            "explicitDefaultValueColumns",
            "mutableColumns",
        ]
    );
}
