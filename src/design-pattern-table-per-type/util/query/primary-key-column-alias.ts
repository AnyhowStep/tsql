import {ITablePerType} from "../../table-per-type";
import {columnAliases} from "./column-alias";

export type PrimaryKeyColumnAlias<TptT extends ITablePerType> =
    | TptT["childTable"]["primaryKey"][number]
    | TptT["parentTables"][number]["primaryKey"][number]
;

export function isPrimaryColumnAlias<TptT extends ITablePerType> (
    tpt : TptT,
    columnAlias : string
) : columnAlias is PrimaryKeyColumnAlias<TptT> {
    if (tpt.childTable.primaryKey.includes(columnAlias)) {
        return true;
    }
    for (const parentTable of tpt.parentTables) {
        if (parentTable.primaryKey.includes(columnAlias)) {
            return true;
        }
    }
    return false;
}

export function primaryKeyColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : PrimaryKeyColumnAlias<TptT>[] {
    const result : string[] = [];

    for (const columnAlias of columnAliases(tpt)) {
        if (isPrimaryColumnAlias(tpt, columnAlias)) {
            result.push(columnAlias);
        }
    }

    return result as PrimaryKeyColumnAlias<TptT>[];
}
