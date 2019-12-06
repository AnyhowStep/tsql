import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";
import {KeyUtil} from "../../../key";
import {ColumnMapUtil} from "../../../column-map";

export type ParentColumnAlias<TptT extends ITablePerType> =
    TableUtil.ColumnAlias<
        | TptT["parentTables"][number]
    >
;

export function parentColumnAliases<TptT extends ITablePerType> (
    tpt : TptT
) : ParentColumnAlias<TptT>[] {
    const result : string[] = [];

    for (const parentTable of tpt.parentTables) {
        result.push(...TableUtil.columnAlias(parentTable));
    }

    return KeyUtil.removeDuplicates(result) as ParentColumnAlias<TptT>[];
}

export function isParentColumnAlias<TptT extends ITablePerType> (
    tpt : TptT,
    columnAlias : string
) : columnAlias is ParentColumnAlias<TptT> {
    for (const parentTable of tpt.parentTables) {
        if (ColumnMapUtil.hasColumnAlias(parentTable.columns, columnAlias)) {
            return true;
        }
    }
    return false;
}
