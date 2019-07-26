import {ColumnMap, WritableColumnMap} from "../../column-map";
import {LeftIntersect, leftIntersect} from "./left-intersect";
import {Merge} from "../../../type-util";

export type IntersectImpl<
    MapA extends ColumnMap,
    MapB extends ColumnMap,
> = (
    & LeftIntersect<MapA, MapB>
    & {
        readonly [columnAlias in Exclude<
            Extract<keyof MapB, string>,
            keyof MapA
        >] : (
            MapB[columnAlias]
        )
    }
);
export type Intersect<
    MapA extends ColumnMap,
    MapB extends ColumnMap,
> = (
    Merge<IntersectImpl<MapA, MapB>>
);
export function intersect<
    MapA extends ColumnMap,
    MapB extends ColumnMap,
> (
    mapA : MapA,
    mapB : MapB
) : (
    Intersect<MapA, MapB>
) {
    const left : LeftIntersect<
        MapA, MapB
    > = leftIntersect(mapA, mapB);

    const right : WritableColumnMap = {};
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
        ...left,
        ...right,
    } as IntersectImpl<MapA, MapB>;
}
