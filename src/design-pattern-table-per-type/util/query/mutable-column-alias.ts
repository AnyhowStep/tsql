import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";
import {ColumnAlias, columnAliases} from "./column-alias";
import {ExtractAllTablesWithColumnAlias} from "./extract-all-tables-with-column-alias";
import {ColumnMapUtil} from "../../../column-map";

export type MutableColumnAlias<TptT extends ITablePerType> =
    {
        [columnAlias in ColumnAlias<TptT>] : (
            TableUtil.IsMutable<
                ExtractAllTablesWithColumnAlias<
                    TptT,
                    columnAlias
                >,
                columnAlias
            > extends true ?
            columnAlias :
            never
        )
    }[ColumnAlias<TptT>]
;

export function isMutableColumnAlias<TptT extends ITablePerType> (
    tpt : TptT,
    columnAlias : string
) : columnAlias is MutableColumnAlias<TptT> {
    if (
        ColumnMapUtil.hasColumnAlias(tpt.childTable.columns, columnAlias) &&
        !tpt.childTable.mutableColumns.includes(columnAlias)
    ) {
        return false;
    }
    for (const parentTable of tpt.parentTables) {
        if (
            ColumnMapUtil.hasColumnAlias(parentTable.columns, columnAlias) &&
            !parentTable.mutableColumns.includes(columnAlias)
        ) {
            return false;
        }
    }
    return true;
}

export function mutableColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : MutableColumnAlias<TptT>[] {
    const result : string[] = [];

    for (const columnAlias of columnAliases(tpt)) {
        if (isMutableColumnAlias(tpt, columnAlias)) {
            result.push(columnAlias);
        }
    }

    return result as MutableColumnAlias<TptT>[];
}
