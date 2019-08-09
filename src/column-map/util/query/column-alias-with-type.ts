import {ColumnMap} from "../../column-map";

export type ColumnAliasWithType<MapT extends ColumnMap, TypeT> = (
    MapT extends ColumnMap ?
    {
        [columnAlias in Extract<keyof MapT, string>] : (
            ReturnType<MapT[columnAlias]["mapper"]> extends TypeT ?
            columnAlias :
            never
        )
    }[Extract<keyof MapT, string>] :
    never
);
