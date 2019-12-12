import {ITablePerType} from "../../table-per-type";
import {ITable, TableUtil} from "../../../table";
import {ColumnAlias, columnAliases} from "./column-alias";
import {isTablePerType} from "../predicate";

export type ExtractColumnAlias<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    ColumnAlias<T> :
    T extends ITable ?
    TableUtil.ColumnAlias<T> :
    never
;

export function extractColumnAliases<
    T extends ITable|ITablePerType
> (t : T) : ExtractColumnAlias<T>[] {
    if (isTablePerType(t)) {
        return columnAliases(t) as string[] as ExtractColumnAlias<T>[];
    } else if (TableUtil.isTable(t)) {
        return TableUtil.columnAlias(t) as string[] as ExtractColumnAlias<T>[];
    } else {
        throw new Error(`Expected ITable or ITablePerType`);
    }
}
