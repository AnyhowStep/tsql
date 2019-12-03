import {ITablePerType} from "../../table-per-type";
import {TableUtil} from "../../../table";
import {KeyUtil} from "../../../key";

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
