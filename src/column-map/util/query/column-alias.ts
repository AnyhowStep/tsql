import {ColumnMap} from "../../column-map";

export type ColumnAlias<MapT extends ColumnMap> = (
    MapT extends ColumnMap ?
    Extract<keyof MapT, string> :
    never
);
export function columnAlias<MapT extends ColumnMap> (
    map : MapT
) : ColumnAlias<MapT>[] {
    return Object.keys(map) as ColumnAlias<MapT>[];
}
