import {ColumnMap, WritableColumnMap} from "../column-map";

export interface ColumnRef {
    readonly [tableAlias : string] : ColumnMap
};
export interface WritableColumnRef {
    [tableAlias : string] : WritableColumnMap
};