import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";
import {KeyUtil} from "../../../key";
import {ColumnMapUtil} from "../../../column-map";

export type ColumnAlias<TptT extends ITablePerType> =
    TableUtil.ColumnAlias<
        | TptT["childTable"]
        | TptT["parentTables"][number]
    >
;

export function columnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : ColumnAlias<TptT>[] {
    const result : string[] = TableUtil.columnAlias(tpt.childTable);

    for (const parentTable of tpt.parentTables) {
        result.push(...TableUtil.columnAlias(parentTable));
    }

    return KeyUtil.removeDuplicates(result) as ColumnAlias<TptT>[];
}

export function isColumnAlias<TptT extends ITablePerType> (
    tpt : TptT,
    columnAlias : string
) : columnAlias is ColumnAlias<TptT> {
    if (ColumnMapUtil.hasColumnAlias(tpt.childTable.columns, columnAlias)) {
        return true;
    }

    for (const parentTable of tpt.parentTables) {
        if (ColumnMapUtil.hasColumnAlias(parentTable.columns, columnAlias)) {
            return true;
        }
    }
    return false;
}
