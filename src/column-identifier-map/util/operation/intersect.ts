import {ColumnIdentifierMap, WritableColumnIdentifierMap} from "../../column-identifier-map";

export type Intersect<
    MapA extends ColumnIdentifierMap,
    MapB extends ColumnIdentifierMap,
> = (
    MapA &
    {
        readonly [columnAlias in Exclude<
            Extract<keyof MapB, string>,
            keyof MapA
        >] : (
            MapB[columnAlias]
        )
    }
);
export function intersect<
    MapA extends ColumnIdentifierMap,
    MapB extends ColumnIdentifierMap,
> (
    mapA : MapA,
    mapB : MapB
) : (
    Intersect<MapA, MapB>
) {
    const right : WritableColumnIdentifierMap = {};
    for (const columnAlias of Object.keys(mapB)) {
        if (
            Object.prototype.hasOwnProperty.call(mapA, columnAlias) &&
            Object.prototype.propertyIsEnumerable.call(mapA, columnAlias)
        ) {
            continue;
        }
        right[columnAlias] = mapB[columnAlias];
    }

    return {
        ...mapA,
        ...right,
    } as Intersect<MapA, MapB>;
}