import * as tm from "type-mapping";
import {ColumnMap, WritableColumnMap} from "../../column-map";
import {ColumnUtil} from "../../../column";

export type ReplaceColumn<
    MapT extends ColumnMap,
    ColumnAliasT extends string,
    TypeT
> = (
    MapT extends ColumnMap ?
    {
        readonly [columnAlias in Extract<keyof MapT, string>] : (
            columnAlias extends ColumnAliasT ?
            ColumnUtil.WithType<
                MapT[columnAlias],
                TypeT
            > :
            MapT[columnAlias]
        )
    } :
    never
);
export function replaceColumn<
    MapT extends ColumnMap,
    ColumnAliasT extends string,
    TypeT
> (
    map : MapT,
    columnAlias : ColumnAliasT,
    mapper : tm.SafeMapper<TypeT>
) : (
    ReplaceColumn<MapT, ColumnAliasT, TypeT>
) {
    const result : WritableColumnMap = {};
    for (const myColumnAlias of Object.keys(map)) {
        if (myColumnAlias == columnAlias) {
            result[myColumnAlias] = ColumnUtil.withType(
                map[myColumnAlias],
                mapper
            );
        } else {
            result[myColumnAlias] = map[myColumnAlias];
        }
    }
    return result as ReplaceColumn<MapT, ColumnAliasT, TypeT>;
}
