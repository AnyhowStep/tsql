
import {ITable, TableUtil} from "../../../table";
import {ITablePerType} from "../../table-per-type";
import {isTablePerType} from "../predicate";

export type ExtractAutoIncrement<
    T extends ITable|ITablePerType
> =
    T extends ITablePerType ?
    T["autoIncrement"][number] :
    T extends ITable ?
    Extract<T["autoIncrement"], string> :
    never
;

export function extractAutoIncrement<T extends ITable|ITablePerType> (
    t : T
) : ExtractAutoIncrement<T>[] {
    if (isTablePerType(t)) {
        return [...t.autoIncrement] as string[] as ExtractAutoIncrement<T>[];
    } else if (TableUtil.isTable(t)) {
        return (
            t.autoIncrement == undefined ?
            [] :
            [t.autoIncrement]
        ) as string[] as ExtractAutoIncrement<T>[];
    } else {
        throw new Error(`Expected ITable or ITablePerType`);
    }
}
