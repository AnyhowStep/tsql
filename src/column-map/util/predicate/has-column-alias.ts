import {ColumnMap} from "../../column-map";

export function hasColumnAlias<MapT extends ColumnMap> (
    map : MapT,
    columnAlias : string
) : columnAlias is Extract<keyof MapT, string> {
    return (
        Object.prototype.hasOwnProperty.call(map, columnAlias) &&
        Object.prototype.propertyIsEnumerable.call(map, columnAlias)
    );
}
