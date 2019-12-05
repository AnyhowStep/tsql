import * as tm from "type-mapping";
import {ColumnMap, WritableColumnMap} from "../../column-map";
import {Column, ColumnUtil} from "../../../column";
import {DataTypeUtil} from "../../../data-type";

//Take the intersection and the "left" columnMap
export type LeftIntersect<
    MapA extends ColumnMap,
    MapB extends ColumnMap,
> = (
    {
        readonly [columnAlias in Extract<keyof MapA, string>] : (
            columnAlias extends keyof MapB ?
            Column<{
                tableAlias : MapA[columnAlias]["tableAlias"],
                columnAlias : MapA[columnAlias]["columnAlias"],
                mapper : tm.SafeMapper<
                    & tm.OutputOf<MapA[columnAlias]["mapper"]>
                    & tm.OutputOf<MapB[columnAlias]["mapper"]>
                >
            }> :
            MapA[columnAlias]
        )
    }
);
export function leftIntersect<
    MapA extends ColumnMap,
    MapB extends ColumnMap,
> (
    mapA : MapA,
    mapB : MapB
) : (
    LeftIntersect<MapA, MapB>
) {
    const result : WritableColumnMap = {};
    for (const columnAlias of Object.keys(mapA)) {
        const columnA = mapA[columnAlias];
        const columnB : unknown = mapB[columnAlias];
        if (ColumnUtil.isColumn(columnB)) {
            result[columnAlias] = new Column(
                {
                    tableAlias : columnA.tableAlias,
                    columnAlias : columnA.columnAlias,
                    mapper : DataTypeUtil.intersect(
                        columnA.mapper,
                        mapB[columnAlias].mapper
                    ),
                },
                columnA.unaliasedAst
            );
        } else {
            result[columnAlias] = columnA;
        }
    }
    return result as LeftIntersect<MapA, MapB>;
};
