import {ITablePerType} from "../../table-per-type";
import {TableUtil, ITable} from "../../../table";
import {ColumnMapUtil} from "../../../column-map";

export type ExtractAllTablesWithColumnAlias<TptT extends ITablePerType, ColumnAliasT extends string> =
    TableUtil.ExtractWithColumnAlias<
        (
            | TptT["childTable"]
            | TptT["parentTables"][number]
        ),
        ColumnAliasT
    >
;

export function extractAllTablesWithColumnAlias<
    TptT extends ITablePerType,
    ColumnAliasT extends string
> (
    tpt : TptT,
    columnAlias : ColumnAliasT
) : ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT>[] {
    const result : ITable[] = [];

    if (ColumnMapUtil.hasColumnAlias(tpt.childTable.columns, columnAlias)) {
        result.push(tpt.childTable);
    }

    for (const parentTable of tpt.parentTables) {
        if (ColumnMapUtil.hasColumnAlias(parentTable.columns, columnAlias)) {
            result.push(parentTable);
        }
    }

    return result as ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT>[];
}
