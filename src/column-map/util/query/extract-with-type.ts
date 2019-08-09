import {ColumnMap} from "../../column-map";
import {ColumnAliasWithType} from "./column-alias-with-type";

export type ExtractWithType<
    MapT extends ColumnMap,
    TypeT
> = (
    MapT extends ColumnMap ?
    {
        readonly [columnAlias in ColumnAliasWithType<MapT, TypeT>] : (
            MapT[columnAlias]
        )
    } :
    never
);
