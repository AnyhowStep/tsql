import {ColumnMap} from "../../column-map";

export type TableAlias<MapT extends ColumnMap> = (
    MapT extends ColumnMap ?
    MapT[Extract<keyof MapT, string>]["tableAlias"] :
    never
);
/**
 * Returns the **first** table alias found.
 *
 * All columns in a `ColumnMap` should have the same table alias.
 * If multiple table aliases exist, the one it returns is arbitrary.
 *
 * If no columns exist, it throws an error.
 */
export function tableAlias<
    MapT extends ColumnMap
> (
    map : MapT
) : (
    TableAlias<MapT>
) {
    const columnAliases = Object.keys(map);
    if (columnAliases.length == 0) {
        throw new Error(`No columns in ColumnMap`);
    } else {
        return map[columnAliases[0]].tableAlias as TableAlias<MapT>;
    }
}
