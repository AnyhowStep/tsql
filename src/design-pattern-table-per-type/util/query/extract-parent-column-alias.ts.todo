
import {ITable, TableUtil} from "../../../table";
import {ITablePerType} from "../../table-per-type";
import {parentColumnAliases} from "./parent-column-alias";
import {isTablePerType} from "../predicate";

export type ExtractParentColumnAlias<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    TableUtil.ColumnAlias<
        T["parentTables"][number]
    > :
    never
;

export function extractParentColumnAliases<T extends ITable|ITablePerType> (
    t : T
) : ExtractParentColumnAlias<T>[] {
    if (isTablePerType(t)) {
        return parentColumnAliases(t) as string[] as ExtractParentColumnAlias<T>[];
    } else {
        return [];
    }
}
