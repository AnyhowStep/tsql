import {ITablePerType} from "../../table-per-type";
import {ColumnMapUtil} from "../../../column-map";
import {ExtractAllTablesWithColumnAlias} from "./extract-all-tables-with-column-alias";

/**
 * Goes up the inheritance hierarchy, starting from `childTable`,
 * to look for a table with `columnAlias` as a column
 */
export function findTableWithColumnAlias<
    TptT extends ITablePerType,
    ColumnAliasT extends string
> (
    tpt : TptT,
    columnAlias : ColumnAliasT
) : ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT> {
    if (ColumnMapUtil.hasColumnAlias(tpt.childTable.columns, columnAlias)) {
        return tpt.childTable as ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT>;
    }

    for (let i=tpt.parentTables.length-1; i>=0; --i) {
        const parentTable = tpt.parentTables[i];
        if (ColumnMapUtil.hasColumnAlias(parentTable.columns, columnAlias)) {
            return parentTable as ExtractAllTablesWithColumnAlias<TptT, ColumnAliasT>;
        }
    }

    throw new Error(`No column ${columnAlias} in table-per-type hierarchy for ${tpt.childTable.alias}`);
}
