import * as tm from "type-mapping";
import {ColumnMap} from "../../column-map";

export type NullableColumnAlias<MapT extends ColumnMap> = (
    MapT extends ColumnMap ?
    {
        [columnAlias in Extract<keyof MapT, string>] : (
            null extends tm.OutputOf<MapT[columnAlias]["mapper"]> ?
            columnAlias :
            never
        )
    }[Extract<keyof MapT, string>] :
    never
);
export function nullableColumnAliases<MapT extends ColumnMap> (
    map : MapT
) : NullableColumnAlias<MapT>[] {
    return Object.keys(map)
        .filter(columnAlias => tm.canOutputNull(
            map[columnAlias].mapper
        )) as NullableColumnAlias<MapT>[];
}
