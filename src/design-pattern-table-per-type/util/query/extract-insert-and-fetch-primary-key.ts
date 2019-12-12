
import {TableUtil, TableWithPrimaryKey, TableWithAutoIncrement} from "../../../table";
import {ITablePerType} from "../../table-per-type";
import {isTablePerType} from "../predicate";

export type ExtractInsertAndFetchPrimaryKey<
    T extends TableWithPrimaryKey|ITablePerType
> =
    T extends ITablePerType ?
    T["insertAndFetchPrimaryKey"][number] :
    T extends TableWithAutoIncrement ?
    never :
    T extends TableWithPrimaryKey ?
    Exclude<
        T["primaryKey"][number],
        | T["generatedColumns"][number]
        | T["autoIncrement"]
    > :
    never
;

export function extractInsertAndFetchPrimaryKey<T extends TableWithPrimaryKey|ITablePerType> (
    t : T
) : ExtractInsertAndFetchPrimaryKey<T>[] {
    if (isTablePerType(t)) {
        return [...t.insertAndFetchPrimaryKey] as string[] as ExtractInsertAndFetchPrimaryKey<T>[];
    } else if (TableUtil.isTable(t) && t.primaryKey != undefined) {
        return (
            t.autoIncrement == undefined ?
            t.primaryKey.filter(
                columnAlias => (
                    !t.generatedColumns.includes(columnAlias) &&
                    t.autoIncrement != columnAlias
                )
            ) :
            []
        ) as string[] as ExtractInsertAndFetchPrimaryKey<T>[];
    } else {
        throw new Error(`Expected TableWithPrimaryKey or ITablePerType`);
    }
}
