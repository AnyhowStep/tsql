
import {ITable, TableUtil} from "../../../table";
import {ITablePerType} from "../../table-per-type";
import {isTablePerType} from "../predicate";

export type ExtractAllTables<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    (
        | T["parentTables"][number]
        | T["childTable"]
    ) :
    T extends ITable ?
    T :
    never
;

export function extractAllTables<T extends ITable|ITablePerType> (
    t : T
) : ExtractAllTables<T>[] {
    if (isTablePerType(t)){
        return [
            ...t.parentTables,
            t.childTable,
        ] as ExtractAllTables<T>[];
    } else if (TableUtil.isTable(t)) {
        return [t] as ExtractAllTables<T>[];
    } else {
        throw new Error(`Expected ITable or ITablePerType`);
    }
}
