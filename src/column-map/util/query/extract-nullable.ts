import {ColumnMap, WritableColumnMap} from "../../column-map";
import {NullableColumnAlias, nullableColumnAliases} from "./nullable-column-alias";

export type ExtractNullable<
    MapT extends ColumnMap
> = (
    MapT extends ColumnMap ?
    {
        readonly [columnAlias in NullableColumnAlias<MapT>] : (
            MapT[columnAlias]
        )
    } :
    never
);
export function extractNullable<
    MapT extends ColumnMap
> (
    map : MapT
) : (
    ExtractNullable<MapT>
) {
    const result : WritableColumnMap = {};
    for (const columnAlias of nullableColumnAliases(map)) {
        result[columnAlias] = map[columnAlias];
    }
    return result as ExtractNullable<MapT>;
}
