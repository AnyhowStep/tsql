import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";
import {ColumnAlias, columnAliases} from "./column-alias";
import {ExtractAllTablesWithColumnAlias} from "./extract-all-tables-with-column-alias";
import {ColumnMapUtil} from "../../../column-map";

export type NullableColumnAlias<TptT extends ITablePerType> =
    {
        [columnAlias in ColumnAlias<TptT>] : (
            TableUtil.IsNullable<
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

export function isNullableColumnAlias<TptT extends ITablePerType> (
    tpt : TptT,
    columnAlias : string
) : columnAlias is NullableColumnAlias<TptT> {
    if (
        ColumnMapUtil.hasColumnAlias(tpt.childTable.columns, columnAlias) &&
        !tpt.childTable.nullableColumns.includes(columnAlias)
    ) {
        return false;
    }
    for (const parentTable of tpt.parentTables) {
        if (
            ColumnMapUtil.hasColumnAlias(parentTable.columns, columnAlias) &&
            !parentTable.nullableColumns.includes(columnAlias)
        ) {
            return false;
        }
    }
    return true;
}

export function nullableColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : NullableColumnAlias<TptT>[] {
    const result : string[] = [];

    for (const columnAlias of columnAliases(tpt)) {
        if (isNullableColumnAlias(tpt, columnAlias)) {
            result.push(columnAlias);
        }
    }

    return result as NullableColumnAlias<TptT>[];
}
