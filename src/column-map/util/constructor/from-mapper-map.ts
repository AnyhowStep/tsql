import * as tm from "type-mapping";
import {WritableColumnMap} from "../../column-map";
import {Column} from "../../../column";
import {MapperMap} from "../../../mapper-map";

export type FromMapperMap<
    TableAliasT extends string,
    MapperMapT extends MapperMap
> = (
    {
        readonly [columnAlias in Extract<keyof MapperMapT, string>] : (
            Column<{
                tableAlias : TableAliasT,
                columnAlias : columnAlias,
                /**
                 * We erase the type of the `mapper` and
                 * replace it with `SafeMapper`.
                 *
                 * This can save us a lot of emit time.
                 */
                mapper : tm.SafeMapper<tm.OutputOf<MapperMapT[columnAlias]>>
            }>
        )
    }
);
export function fromMapperMap<
    TableAliasT extends string,
    MapperMapT extends MapperMap
> (
    tableAlias : TableAliasT,
    mapperMap : MapperMapT
) : (
    FromMapperMap<TableAliasT, MapperMapT>
) {
    const result : WritableColumnMap = {};
    for (const columnAlias of Object.keys(mapperMap)) {
        result[columnAlias] = new Column(
            {
                tableAlias,
                columnAlias,
                mapper : mapperMap[columnAlias],
            },
            undefined
        );
    }
    return result as FromMapperMap<TableAliasT, MapperMapT>;
}
