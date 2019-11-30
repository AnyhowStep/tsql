import {ColumnMap, WritableColumnMap} from "../../column-map";
import {NonNullableColumnAlias, nonNullableColumnAliases} from "./non-nullable-column-alias";

export type ExtractNonNullable<
    MapT extends ColumnMap
> = (
    MapT extends ColumnMap ?
    {
        readonly [columnAlias in NonNullableColumnAlias<MapT>] : (
            MapT[columnAlias]
        )
    } :
    never
);
export function extractNonNullable<
    MapT extends ColumnMap
> (
    map : MapT
) : (
    ExtractNonNullable<MapT>
) {
    const result : WritableColumnMap = {};
    for (const columnAlias of nonNullableColumnAliases(map)) {
        result[columnAlias] = map[columnAlias];
    }
    return result as ExtractNonNullable<MapT>;
}
