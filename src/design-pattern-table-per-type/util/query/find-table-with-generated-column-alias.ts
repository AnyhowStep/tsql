import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";

export type ExtractAllTablesWithGeneratedColumnAlias<TptT extends ITablePerType, ColumnAliasT extends string> =
    TableUtil.ExtractWithGeneratedColumnAlias<
        (
            | TptT["childTable"]
            | TptT["parentTables"][number]
        ),
        ColumnAliasT
    >
;

/**
 * Goes up the inheritance hierarchy, starting from `childTable`,
 * to look for a table with `columnAlias` as
 */
export function findTableWithGeneratedColumnAlias<
    TptT extends ITablePerType,
    ColumnAliasT extends string
> (
    tpt : TptT,
    columnAlias : ColumnAliasT
) : ExtractAllTablesWithGeneratedColumnAlias<TptT, ColumnAliasT> {
    if (tpt.childTable.generatedColumns.includes(columnAlias)) {
        return tpt.childTable as ExtractAllTablesWithGeneratedColumnAlias<TptT, ColumnAliasT>;
    }

    for (let i=tpt.parentTables.length-1; i>=0; --i) {
        const parentTable = tpt.parentTables[i];
        if (parentTable.generatedColumns.includes(columnAlias)) {
            return parentTable as ExtractAllTablesWithGeneratedColumnAlias<TptT, ColumnAliasT>;
        }
    }

    throw new Error(`No generated column ${columnAlias} in table-per-type hierarchy for ${tpt.childTable.alias}`);
}
