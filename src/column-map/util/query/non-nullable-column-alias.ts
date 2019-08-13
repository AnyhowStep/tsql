import * as tm from "type-mapping";
import {ColumnMap} from "../../column-map";

export type NonNullableColumnAlias<MapT extends ColumnMap> = (
    MapT extends ColumnMap ?
    {
        [columnAlias in Extract<keyof MapT, string>] : (
            null extends tm.OutputOf<MapT[columnAlias]["mapper"]> ?
            never :
            columnAlias
        )
    }[Extract<keyof MapT, string>] :
    never
);
export function nonNullableColumnAliases<MapT extends ColumnMap> (
    map : MapT
) : NonNullableColumnAlias<MapT>[] {
    return Object.keys(map)
        .filter(columnAlias => !tm.canOutputNull(
            map[columnAlias].mapper
        )) as NonNullableColumnAlias<MapT>[];
}
