import {ColumnIdentifierMap, WritableColumnIdentifierMap} from "../column-identifier-map";

export interface ColumnIdentifierRef {
    readonly [tableAlias : string] : ColumnIdentifierMap
};
export interface WritableColumnIdentifierRef {
    [tableAlias : string] : WritableColumnIdentifierMap
};