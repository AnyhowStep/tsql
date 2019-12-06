import {ITable, TableUtil} from "../../../table";
import {ITablePerType} from "../../table-per-type";

export type ExtractChildTable<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    T["childTable"] :
    T
;

export function extractChildTable<T extends ITable|ITablePerType> (
    t : T
) : ExtractChildTable<T> {
    if (TableUtil.isTable(t)) {
        return t as ExtractChildTable<T>;
    } else {
        return (t as Extract<T, ITablePerType>).childTable as ExtractChildTable<T>;
    }
}
