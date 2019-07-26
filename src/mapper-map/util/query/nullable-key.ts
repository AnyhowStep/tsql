import * as tm from "type-mapping";
import {MapperMap} from "../../mapper-map";

export type NullableKey<
    MapT extends MapperMap
> = (
    {
        [columnAlias in Extract<keyof MapT, string>] : (
            null extends tm.OutputOf<MapT[columnAlias]> ?
            columnAlias :
            never
        )
    }[Extract<keyof MapT, string>]
);
export function nullableKeys<MapT extends MapperMap> (
    map : MapT
) : (
    NullableKey<MapT>[]
) {
    const columnAliases = Object.keys(map) as Extract<keyof MapT, string>[];
    return columnAliases.filter(
        columnAlias => tm.canOutputNull(map[columnAlias])
    ) as any;
}
