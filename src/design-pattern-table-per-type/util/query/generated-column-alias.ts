import {ITablePerType} from "../../table-per-type";
import {columnAliases} from "./column-alias";

export type GeneratedColumnAlias<TptT extends ITablePerType> =
    (
        | TptT["childTable"]
        | TptT["parentTables"][number]
    )["generatedColumns"][number]
;

export function isGeneratedColumnAlias<TptT extends ITablePerType> (
    tpt : TptT,
    columnAlias : string
) : columnAlias is GeneratedColumnAlias<TptT> {
    if (tpt.childTable.generatedColumns.includes(columnAlias)) {
        return true;
    }

    for (const parentTable of tpt.parentTables) {
        if (parentTable.generatedColumns.includes(columnAlias)) {
            return true;
        }
    }
    return false;
}

export function generatedColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : GeneratedColumnAlias<TptT>[] {
    const result : string[] = [];

    for (const columnAlias of columnAliases(tpt)) {
        if (isGeneratedColumnAlias(tpt, columnAlias)) {
            result.push(columnAlias);
        }
    }

    return result as GeneratedColumnAlias<TptT>[];
}
