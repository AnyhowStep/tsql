import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";
import {ColumnAlias, columnAliases} from "./column-alias";
import {ParentColumnAlias, isParentColumnAlias} from "./parent-column-alias";
import {ExtractAllParentTablesWithColumnAlias} from "./extract-all-parent-tables-with-column-alias";
import {ColumnMapUtil} from "../../../column-map";

export type ExplicitDefaultValueColumnAlias<TptT extends ITablePerType> =
    {
        [columnAlias in ColumnAlias<TptT>] : (
            columnAlias extends ParentColumnAlias<TptT> ?
            (
                TableUtil.HasExplicitDefaultValue<
                    ExtractAllParentTablesWithColumnAlias<TptT, columnAlias>,
                    columnAlias
                > extends true ?
                columnAlias :
                never
            ) :
            (
                TableUtil.HasExplicitDefaultValue<
                    TptT["childTable"],
                    columnAlias
                > extends true ?
                columnAlias :
                never
            )
        )
    }[ColumnAlias<TptT>]
;

export function isExplicitDefaultValueColumnAlias<TptT extends ITablePerType> (
    tpt : TptT,
    columnAlias : string
) : columnAlias is ExplicitDefaultValueColumnAlias<TptT> {
    if (isParentColumnAlias(tpt, columnAlias)) {
        for (const parentTable of tpt.parentTables) {
            if (
                ColumnMapUtil.hasColumnAlias(parentTable.columns, columnAlias) &&
                !parentTable.explicitDefaultValueColumns.includes(columnAlias)
            ) {
                return false;
            }
        }
        return true;
    } else {
        return tpt.childTable.explicitDefaultValueColumns.includes(columnAlias);
    }
}

export function explicitDefaultValueColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : ExplicitDefaultValueColumnAlias<TptT>[] {
    const result : string[] = [];

    for (const columnAlias of columnAliases(tpt)) {
        if (isExplicitDefaultValueColumnAlias(tpt, columnAlias)) {
            result.push(columnAlias);
        }
    }

    return result as ExplicitDefaultValueColumnAlias<TptT>[];
}
