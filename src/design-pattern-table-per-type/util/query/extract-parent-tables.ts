
import {ITable, TableUtil} from "../../../table";
import {ITablePerType} from "../../table-per-type";

export type ExtractParentTables<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    T["parentTables"][number] :
    never
;

export function extractParentTables<T extends ITable|ITablePerType> (
    t : T
) : ExtractParentTables<T>[] {
    if (TableUtil.isTable(t)) {
        return [] as ExtractParentTables<T>[];
    } else {
        return [...(t as Extract<T, ITablePerType>).parentTables] as ExtractParentTables<T>[];
    }
}
