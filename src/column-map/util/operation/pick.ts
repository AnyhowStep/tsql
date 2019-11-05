import {ColumnMap} from "../../column-map";

export function pick<
    MapT extends ColumnMap,
    ArrT extends readonly string[]
>(
    map : MapT,
    arr : ArrT
) : Pick<MapT, ArrT[number]> {
    const result : any = {};
    for (const columnAlias of Object.keys(map)) {
        if (arr.indexOf(columnAlias) >= 0) {
            result[columnAlias] = map[columnAlias];
        }
    }
    return result;
}
