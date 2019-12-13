
import {ITable, TableUtil} from "../../../table";
import {ITablePerType} from "../../table-per-type";
import {isTablePerType} from "../predicate";

export type ExtractChildColumnAlias<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    TableUtil.ColumnAlias<T["childTable"]> :
    T extends ITable ?
    TableUtil.ColumnAlias<T> :
    never
;

export function extractChildColumnAliases<T extends ITable|ITablePerType> (
    t : T
) : ExtractChildColumnAlias<T>[] {
    if (isTablePerType(t)) {
        return TableUtil.columnAlias(t.childTable) as string[] as ExtractChildColumnAlias<T>[];
    } else if (TableUtil.isTable(t)) {
        return TableUtil.columnAlias(t) as string[] as ExtractChildColumnAlias<T>[];
    } else {
        throw new Error(`Expected ITable or ITablePerType`);
    }
}
