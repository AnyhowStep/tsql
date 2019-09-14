import {ColumnMap, WritableColumnMap} from "../../column-map";
import {LeftCompound, leftCompound} from "./left-compound";
import {Merge} from "../../../type-util";

export type CompoundImpl<
    MapA extends ColumnMap,
    MapB extends ColumnMap,
> = (
    & LeftCompound<MapA, MapB>
    & {
        readonly [columnAlias in Exclude<
            Extract<keyof MapB, string>,
            keyof MapA
        >] : (
            MapB[columnAlias]
        )
    }
);
/**
 * Like `Intersect`, but the type of columns is unioned,
 * not intersected.
 *
 * This is used to implement `CompoundQueryClauseUtil.compoundQuery()`
 *
 * @todo Better name?
 */
export type Compound<
    MapA extends ColumnMap,
    MapB extends ColumnMap,
> = (
    Merge<CompoundImpl<MapA, MapB>>
);
export function compound<
    MapA extends ColumnMap,
    MapB extends ColumnMap,
> (
    mapA : MapA,
    mapB : MapB
) : (
    Compound<MapA, MapB>
) {
    const left : LeftCompound<
        MapA, MapB
    > = leftCompound(mapA, mapB);

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
    } as CompoundImpl<MapA, MapB>;
}
